import { useEffect, useMemo, useRef, useState } from "react";
import { IDataset } from "../interface";
import { IMessage } from "../services/llm";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./react-vega";
import { HandThumbDownIcon, HandThumbUpIcon, TrashIcon, UserIcon } from "@heroicons/react/20/solid";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import DataTable from "./datasetCreation/dataTable";
import { GraphicWalker } from "@kanaries/graphic-walker";
import { parseGW } from "../utils/gwParser";
import { IAnalyticType } from "@kanaries/graphic-walker/dist/interfaces";

interface VizChatProps {
    messages: IMessage[];
    dataset: IDataset;
    onDelete?: (message: IMessage, mIndex: number) => void;
    onUserFeedback?: (messagePair: IMessage[], mIndex: number, action: string) => void;
}

const VizChat: React.FC<VizChatProps> = ({ messages, dataset, onDelete, onUserFeedback }) => {
    const container = useRef<HTMLDivElement>(null);
    const [editIndex, setEditIndex] = useState<number>(-1);
    // useEffect(() => {
    //     if (container.current) {
    //         container.current.scrollTop = container.current.scrollHeight;
    //     }
    // }, [messages]);

    const gwMetas = useMemo(() => {
        return dataset.fields.map(m => ({
            ...m,
            analyticType: m.semanticType === 'quantitative' ? 'measure' : 'dimension' as IAnalyticType
        }))
    }, [dataset])
    return (
        <div className="border-2 border-zinc-100 dark:border-zinc-800 overflow-y-auto" ref={container} style={{ maxHeight: "80vh" }}>
            {messages.map((message, index) => {
                if (message.role === "assistant") {
                    const spec = getValidVegaSpec(message.content, dataset);
                    if (spec) {

                        return (
                            <div className="p-4 flex justify-top" key={index}>
                                <div className="grow-0">
                                    <div className="inline-block h-10 w-10 rounded-full mx-4 bg-indigo-500 text-white flex items-center justify-center">
                                        <CpuChipIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="grow pl-8">
                                    {
                                        editIndex !== index && <ReactVega spec={spec} data={dataset.dataSource ?? []} />
                                    }
                                    {
                                        editIndex === index && <GraphicWalker dark="media" spec={parseGW(spec)} dataSource={dataset.dataSource ?? []} rawFields={gwMetas} hideDataSourceConfig fieldKeyGuard={false} />
                                    }
                                    {/* {
                                        editIndex === index && <GraphicWalker />
                                    } */}
                                    {/* <ReactVega spec={spec} data={dataset.dataSource ?? []} /> */}
                                </div>
                                <div className="float-right flex gap-4 items-start">
                                    <button onClick={() => {
                                        setEditIndex(index)
                                    }}>edit</button>
                                    <HandThumbUpIcon
                                        className="w-4 text-gray-500 dark:text-gray-300 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onUserFeedback &&
                                                onUserFeedback([messages[index - 1], message], index, "like");
                                        }}
                                    />
                                    <HandThumbDownIcon
                                        className="w-4 text-gray-500 dark:text-gray-300 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onUserFeedback &&
                                                onUserFeedback([messages[index - 1], message], index, "dislike");
                                        }}
                                    />
                                    <TrashIcon
                                        className="w-4 text-gray-500 dark:text-gray-300 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onDelete && onDelete(message, index);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="p-4 flex justify-top" key={index}>
                                <div className="grow-0">
                                    <div className="inline-block h-10 w-10 rounded-full mx-4 bg-indigo-500 text-white flex items-center justify-center">
                                        <CpuChipIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="grow pl-8 overflow-x-auto">
                                    <p>{message.content}</p>
                                    <DataTable
                                        data={dataset.dataSource}
                                        metas={dataset.fields}
                                        onMetaChange={() => {
                                            console.log("meta changed");
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }
                }
                return (
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 flex" key={index}>
                        <div className="grow-0">
                            <div className="inline-block h-10 w-10 rounded-full mx-4 bg-green-500 text-white flex items-center justify-center">
                                <UserIcon className="w-6" />
                            </div>
                        </div>
                        <div className="grow pl-8">
                            <p>{message.content}</p>
                        </div>
                        <div className="float-right">
                            <TrashIcon
                                className="w-4 text-gray-500 dark:text-gray-300 cursor-pointer hover:scale-125"
                                onClick={() => {
                                    onDelete && onDelete(message, index);
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VizChat;
