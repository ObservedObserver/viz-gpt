/* eslint-disable no-useless-escape */
import { useCallback, useEffect, useState } from "react";
import { IMessage, chatCompletation } from "./services/llm";
import { matchQuote } from "./utils";
import { IDataset } from "./interface";
import VizChat from "./components/vizChat";
import SelectMenu from "./components/selectMenu";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import Spinner from "./components/spinner";
import DatasetCreation from "./components/datasetCreation";
import DataTable from "./components/datasetCreation/dataTable";
import { produce } from "immer";

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

    useEffect(() => {
        const currentDatasetInfo =
            dsList.find((dataset) => dataset.key === datasetKey) ??
            dsList[0];
        if (currentDatasetInfo.type === "demo") {
            fetch(currentDatasetInfo.url)
                .then((res) => res.json())
                .then((res) => {
                    setDataset(res);
                });
        } else {
            setDataset(currentDatasetInfo.dataset);
        }
    }, [datasetKey, dsList]);

    const startQuery = useCallback(() => {
        setLoading(true);
        const latestQuery: IMessage = {
            role: "user",
            content: userQuery,
        };
        chatCompletation([...chat, latestQuery], dataset?.fields ?? [])
            .then((res) => {
                if (res.choices.length > 0) {
                    const spec = matchQuote(
                        res.choices[0].message.content,
                        "{",
                        "}"
                    );
                    if (spec) {
                        setChat([...chat, latestQuery, res.choices[0].message]);
                    }
                }
            })
            .finally(() => {
                setLoading(false);
                setUserQuery("");
            });
    }, [userQuery, chat, dataset?.fields]);

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
                            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                            onClick={() => {
                                setPivotKey("viz");
                            }}
                        >
                            Visualization
                        </button>
                        <button
                            type="button"
                            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
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
                    {dataset && <VizChat dataset={dataset} messages={chat} />}
                    <div className="right-0 py-8 flex">
                        <input
                            type="text"
                            className="block w-full rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="what visualization your want to draw from the dataset"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
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
            {
                pivotKey === 'data' && <div>
                    {
                        dataset && <DataTable data={dataset.dataSource} metas={dataset.fields} onMetaChange={(fid, fIndex, meta) => {
                            const nextDataset = produce(dataset, (draft) => {
                                draft.fields[fIndex] = {
                                    ...draft.fields[fIndex],
                                    ...meta,
                                };
                            });
                            setDataset(nextDataset);
                        }} />
                    }
                </div>
            }
        </div>
    );
};

export default HomePage;
