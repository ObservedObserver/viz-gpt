import { useEffect } from "react";
import { IDataset } from "../interface";
import { IMessage } from "../services/llm";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./react-vega";

interface VizChatProps {
    messages: IMessage[];
    dataset: IDataset;
}

const VizChat: React.FC<VizChatProps> = ({ messages, dataset }) => {
    useEffect(() => {
        const container = document.getElementById("chat-container");
        if (container) {
            container.scrollTop = container.scrollHeight;
            console.log('scroll')
        }
    }, [messages])
    return (
        <div className="border-2 border-zinc-100 overflow-y-auto" id="chat-container" style={{ maxHeight: '80vh'}}>
            {messages.map((message, index) => {
                if (message.role === "assistant") {
                    const spec = getValidVegaSpec(message.content);
                    if (spec) {
                        return (
                            <div className="p-4" key={index}>
                                <p>{message.role}</p>
                                <ReactVega
                                    spec={spec}
                                    data={dataset.dataSource ?? []}
                                />
                            </div>
                        );
                    }
                }
                return (
                    <div className="p-4 bg-zinc-100" key={index}>
                        {/* <p>{message.role}</p> */}
                        <p>{message.content}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default VizChat;
