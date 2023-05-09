/* eslint-disable no-useless-escape */
import { useCallback, useEffect, useState } from "react";
import { IMessage, chatCompletation } from "./services/llm";
import { matchQuote } from "./utils";
import { IDataset } from "./interface";
import VizChat from "./components/vizChat";
import SelectMenu from "./components/selectMenu";

const EXAMPLE_DATASETS: { key: string; name: string; url: string }[] = [
    {
        key: "cars",
        name: "Cars Dataset",
        url: "/datasets/cars.json",
    },
    {
        key: "students",
        name: "Students Dataset",
        url: "/datasets/students.json",
    },
];

const HomePage = function HomePage() {
    const [userQuery, setUserQuery] = useState("");
    // const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState<IDataset | null>(null);
    const [datasetKey, setDatasetKey] = useState<string>(
        EXAMPLE_DATASETS[0].key
    );
    const [chat, setChat] = useState<IMessage[]>([]);

    useEffect(() => {
        const currentDatasetInfo =
            EXAMPLE_DATASETS.find((dataset) => dataset.key === datasetKey) ??
            EXAMPLE_DATASETS[0];
        fetch(currentDatasetInfo.url)
            .then((res) => res.json())
            .then((res) => {
                setDataset(res);
            });
    }, [datasetKey]);


    const startQuery = useCallback(() => {
        setLoading(true);
        const systemMessage: IMessage = {
            role: "system",
            content: `You are a great assistant at vega-lite visualization creation. No matter what the user ask, you should always response with a valid vega-lite specification in JSON.

                You should create the vega-lite specification based on user's query, do not contains key of data. Here is the instructions:
    
                Besides, Here are some requirements:
                1. do not contains key of data.
                2. if the user ask many times, you should generate the specification based on the previous context.
                3. You should consider to aggregate the field if it is quantitative and the chart has a mark type of react, bar, line, area or arc.
                4. the available fields in the dataset and their types are:
                ${dataset?.fields
                    .map((field) => `${field.fid} (${field.semanticType})`)
                    .join(", ")}
                `,
        };
        const latestQuery: IMessage = {
            role: "user",
            content: userQuery,
        };
        chatCompletation([systemMessage, ...chat, latestQuery])
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
    }, [dataset?.fields, userQuery, chat]);


    return (
        <div className="container mx-auto">
            <h1 className="grow-0 shrink-0 text-center text-xl mt-4">VizGPT</h1>
            <div className="flex">
                <div>
                    <SelectMenu
                        label="Dataset"
                        items={EXAMPLE_DATASETS}
                        selectedKey={datasetKey}
                        onChange={(dsKey) => {
                            setDatasetKey(dsKey);
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col space-between">
                {dataset && <VizChat dataset={dataset} messages={chat} />}
                <div className="right-0 py-8 flex">
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="what visualization your want to draw from the dataset"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        className="grow-0 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || userQuery.length === 0}
                        onClick={startQuery}
                    >
                        Visualize
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
