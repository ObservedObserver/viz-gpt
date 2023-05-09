import { useEffect, useRef } from "react";
import { IDataset } from "../interface";
import { IMessage } from "../services/llm";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./react-vega";
import { UserIcon } from "@heroicons/react/20/solid";
import { CpuChipIcon } from "@heroicons/react/24/outline";

interface VizChatProps {
    messages: IMessage[];
    dataset: IDataset;
}

const VizChat: React.FC<VizChatProps> = ({ messages, dataset }) => {
    const container = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div
            className="border-2 border-zinc-100 overflow-y-auto"
            ref={container}
            style={{ maxHeight: "80vh" }}
        >
            {messages.map((message, index) => {
                if (message.role === "assistant") {
                    const spec = getValidVegaSpec(message.content);
                    if (spec) {
                        return (
                            <div className="p-4 flex justify-top" key={index}>
                                <div className="grow-0">
                                    <div className="inline-block h-10 w-10 rounded-full mx-4 bg-indigo-500 text-white flex items-center justify-center">
                                        <CpuChipIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="grow pl-8">
                                    <ReactVega
                                        spec={spec}
                                        data={dataset.dataSource ?? []}
                                    />
                                </div>
                            </div>
                        );
                    }
                }
                return (
                    <div className="p-4 bg-zinc-100 flex" key={index}>
                        <div className="grow-0">
                            <div className="inline-block h-10 w-10 rounded-full mx-4 bg-green-500 text-white flex items-center justify-center">
                                <UserIcon className="w-6" />
                            </div>
                        </div>
                        <div className="grow pl-8">
                            <p>{message.content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VizChat;
