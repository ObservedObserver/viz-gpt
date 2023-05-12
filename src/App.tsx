/* eslint-disable no-useless-escape */
import { useCallback, useEffect, useState } from "react";
import { track } from '@vercel/analytics';
import { IMessage, chatCompletation } from "./services/llm";
import { matchQuote } from "./utils";
import { IDataset } from "./interface";
import VizChat from "./components/vizChat";
import SelectMenu from "./components/selectMenu";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/20/solid";
import Spinner from "./components/spinner";
import DatasetCreation from "./components/datasetCreation";
import DataTable from "./components/datasetCreation/dataTable";
import { produce } from "immer";
import { useNotification } from "./components/notify/useNotification";
import { WelcomePrompt } from "./components/welcomePrompt";

type DSItem =
    | {
          key: string;
          name: string;
          url: string;
          type: "demo";
      }
    | {
          key: string;
          name: string;
          dataset: IDataset;
          type: "custom";
      };

const EXAMPLE_DATASETS: DSItem[] = [
    {
        key: "cars",
        name: "Cars Dataset",
        url: "/datasets/cars.json",
        type: "demo",
    },
    {
        key: "students",
        name: "Students Dataset",
        url: "/datasets/students.json",
        type: "demo",
    },
];

const HomePage = function HomePage() {
    const [userQuery, setUserQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState<IDataset | null>(null);
    const [dsList, setDsList] = useState<DSItem[]>(EXAMPLE_DATASETS);
    const [pivotKey, setPivotKey] = useState<string>("viz");
    const [datasetKey, setDatasetKey] = useState<string>(
        EXAMPLE_DATASETS[0].key
    );
    const [chat, setChat] = useState<IMessage[]>([]);
    const { notify } = useNotification();

    useEffect(() => {
        const currentDatasetInfo =
            dsList.find((dataset) => dataset.key === datasetKey) ?? dsList[0];
        if (currentDatasetInfo.type === "demo") {
            fetch(currentDatasetInfo.url)
                .then((res) => res.json())
                .then((res) => {
                    setDataset(res);
                })
                .catch(() => {
                    notify(
                        {
                            title: "Error",
                            message: "Dataset not found",
                            type: "error",
                        },
                        3000
                    );
                });
        } else {
            setDataset(currentDatasetInfo.dataset);
        }
    }, [datasetKey, dsList, notify]);

    const startQuery = useCallback(() => {
        setLoading(true);
        const latestQuery: IMessage = {
            role: "user",
            content: userQuery,
        };
        const fields = dataset?.fields ?? [];
        track('query', { query: userQuery, chatSize: chat.length, keys: fields.map(f => f.fid).join(',') })
        chatCompletation([...chat, latestQuery], fields)
            .then((res) => {
                if (res.choices.length > 0) {
                    const spec = matchQuote(
                        res.choices[0].message.content,
                        "{",
                        "}"
                    );
                    if (spec) {
                        setChat([...chat, latestQuery, res.choices[0].message]);
                    } else {
                        setChat([...chat, latestQuery, {
                            role: 'assistant',
                            content: 'There is no relative visualization for your query. Please check the dataset and try again.',
                        }]);
                        // throw new Error(
                        //     "No visualization matches your instruction.\n" +
                        //         res.choices[0].message.content
                        // );
                    }
                }
            })
            .catch((err) => {
                notify(
                    {
                        title: "Error",
                        message: err.message,
                        type: "error",
                    },
                    3000
                );
            })
            .finally(() => {
                setLoading(false);
                setUserQuery("");
            });
    }, [userQuery, chat, dataset, notify]);

    const clearChat = useCallback(() => {
        setChat([]);
    }, []);

    const feedbackHandler = useCallback(
        (messages: IMessage[], mIndex: number, action: string) => {
            // todo: implement feedback handler
            track('feedback', { query: messages[0]?.content, ans: messages[1]?.content, action })
            notify({
                title: "Feedback",
                message: "Thanks for your feedback!",
                type: "success",
            }, 1000)
        },
        [notify]
    );

    return (
        <div className="container mx-auto">
            <div className="text-5xl font-extrabold flex justify-center mt-8">
                <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                    VizGPT
                </h1>
            </div>

            <div className="flex items-end my-2">
                <div>
                    <SelectMenu
                        label="Dataset"
                        items={dsList}
                        selectedKey={datasetKey}
                        onChange={(dsKey) => {
                            setDatasetKey(dsKey);
                        }}
                    />
                </div>
                <DatasetCreation
                    onDatasetCreated={(ds) => {
                        const k = "custom" + dsList.length;
                        setDsList((l) => [
                            ...l,
                            {
                                name: "Custom Dataset" + l.length,
                                key: k,
                                dataset: ds,
                                type: "custom",
                            },
                        ]);
                        setDatasetKey(k);
                    }}
                />
                <div className="ml-4">
                    <span className="isolate inline-flex rounded-md shadow-sm">
                        <button
                            type="button"
                            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-500 hover:text-white focus:z-10 ${
                                pivotKey === "viz"
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : ""
                            }`}
                            onClick={() => {
                                setPivotKey("viz");
                            }}
                        >
                            Chat to Viz
                        </button>
                        <button
                            type="button"
                            className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-500 hover:text-white focus:z-10 ${
                                pivotKey === "data"
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : ""
                            }`}
                            onClick={() => {
                                setPivotKey("data");
                            }}
                        >
                            Data
                        </button>
                    </span>
                </div>
            </div>
            {pivotKey === "viz" && (
                <div className="flex flex-col space-between">
                    {dataset && chat.length === 0 && (
                        <WelcomePrompt
                            metas={dataset.fields}
                            onPromptClick={(p) => {
                                setUserQuery(p);
                            }}
                        />
                    )}
                    {dataset && chat.length > 0 && (
                        <VizChat
                            dataset={dataset}
                            messages={chat}
                            onDelete={(message, mIndex) => {
                                if (message.role === "user") {
                                    setChat((c) => {
                                        const newChat = [...c];
                                        newChat.splice(mIndex, 2);
                                        return newChat;
                                    });
                                } else if (message.role === 'assistant') {
                                    setChat((c) => {
                                        const newChat = [...c];
                                        newChat.splice(mIndex - 1, 2);
                                        return newChat;
                                    });
                                }
                            }}
                            onUserFeedback={feedbackHandler}
                        />
                    )}
                    <div className="right-0 py-8 flex">
                        <button
                            type="button"
                            className="flex items-center grow-0 rounded-l-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-500 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                            onClick={clearChat}
                        >
                            Clear
                            {!loading && <TrashIcon className="w-4 ml-1" />}
                        </button>
                        <input
                            type="text"
                            className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="what visualization your want to draw from the dataset"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && loading === false && userQuery.length > 0) {
                                    startQuery();
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="flex items-center grow-0 rounded-r-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || userQuery.length === 0}
                            onClick={startQuery}
                        >
                            Visualize
                            {!loading && (
                                <PaperAirplaneIcon className="w-4 ml-1" />
                            )}
                            {loading && <Spinner />}
                        </button>
                    </div>
                </div>
            )}
            {pivotKey === "data" && (
                <div>
                    {dataset && (
                        <DataTable
                            data={dataset.dataSource}
                            metas={dataset.fields}
                            onMetaChange={(fid, fIndex, meta) => {
                                const nextDataset = produce(
                                    dataset,
                                    (draft) => {
                                        draft.fields[fIndex] = {
                                            ...draft.fields[fIndex],
                                            ...meta,
                                        };
                                    }
                                );
                                setDataset(nextDataset);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
