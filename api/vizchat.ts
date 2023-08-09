/* eslint-disable @typescript-eslint/ban-ts-comment */
import { VercelRequest, VercelResponse } from "@vercel/node";
import { IMessage } from "../src/services/llm";
import fetch from "node-fetch";
import { IField } from "../src/interface";

interface RequestBody {
    messages: IMessage[];
    metas: IField[];
}
export interface IResponseData {
    id: string;
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: { message: { role: string; content: string } }[];
}

const TEMPERATURE = 0.05;

function matchQuote(str: string, left: string, right: string): string | null {
    let stack = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === left) {
            if (stack === 0) {
                start = i;
            }
            stack++;
        }
        if (str[i] === right) {
            stack--;
            if (stack === 0) {
                end = i;
                break;
            }
        }
    }
    if (start !== -1 && end !== -1) {
        return str.substring(start, end + 1);
    }
    return null;
}

export default async function (req: VercelRequest, res: VercelResponse) {
    const { messages = [], metas = [] } = req.body as RequestBody;
    const systemMessage: IMessage = {
        role: "system",
        content: `You are a great assistant called vizGPT(visualization GPT) good at vega-lite visualization creation.

            1. You should create the vega-lite specification based on user's query.
            2. If the question is about analysis current dataset, you must directly answer it without saying anything else.
            3. If the question is not about analysis current dataset.you must directly list some question the user can asked about the data without saying anything else.
            4. Do not say any word about vega/vega-lite/SQL/specification, the user is not tech background.

            Besides, Here are some requirements for the vega-lite:
            1. Do not contain the key called 'data' in vega-lite specification.
            2. If the user ask many times, you should generate the specification based on the previous context.
            3. You should consider to aggregate the field if it is quantitative and the chart has a mark type of react, bar, line, area or arc.
            4. Consider to use bin for field if it is a chart like heatmap or histogram.
            5. The available fields in the dataset and their types are:
            ${metas
                .map((field) => `${field.name} (${field.semanticType})`)
                .join(", ")}
            `,
    };
    // If the field is aggregated or transformed, the field title in spec should contains both the aggregate/transform info and the column title. For example, the title of field sales aggregated by mean should be "Mean(Sales)",
    if (messages.length === 0 || metas.length === 0) {
        res.status(400).json({
            success: false,
            message: `[vizchat error] messages or metas is empty.`,
        });
        return;
    }
    if (messages[messages.length - 1].role === "user") {
        messages[
            messages.length - 1
        ].content = `
        Translate text delimited by triple backticks into vega-lite specification in JSON string.
        Or answer my question based on the dataset only in the case my question is about analysis the dataset.
        Otherwise show me a valid question directly.
        \`\`\`
        ${messages[messages.length - 1].content}
        \`\`\`
        
        `;
        //  If there is no valid vega-lite specification or the instruction is not clear, you can recommend a chart from the given dataset and print in vega-lite JSON string.
    }
    console.log(messages)
    try {
        const pureMessage = messages.map(m => {
            if (m.role === 'user') {
                const q = matchQuote(m.content, '```', '```');
                if (q !== null && q.length > 6) {
                    return {
                        ...m,
                        content: q
                    }
                }
                return m;
            }
            if (m.role === 'assistant') return m;
            const spec = matchQuote(m.content, '{', '}');
            if (spec !== null) {
                return {
                    ...m,
                    content: JSON.stringify(spec)
                }
            }
            return m
        })
        const data = await getCompletion([systemMessage, ...pureMessage]);
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `[vizchat error] failed task.`,
        });
    }
    return;
}

async function getCompletion(messages: IMessage[]): Promise<IResponseData> {
    if (preferAzureOpenAI()) {
        return getAzureOpenAICompletion(messages);
    }
    return getOpenAICompletion(messages)
}

function preferAzureOpenAI(): boolean {
    return !!(process.env.BASE_URL && process.env.DEPLOYMENT_NAME && process.env.AZURE_OPENAI_KEY);
}

async function getAzureOpenAICompletion(messages: IMessage[]): Promise<IResponseData> {
    const url = `${process.env.BASE_URL}/openai/deployments/${process.env.DEPLOYMENT_NAME}/chat/completions?api-version=2023-03-15-preview`;
    const response = await fetch(url, {
        method: "POST",
        // @ts-ignore
        headers: {
            "Content-Type": "application/json",
            // @ts-ignore
            "api-key": process.env.AZURE_OPENAI_KEY,
        },
        body: JSON.stringify({
            messages,
            temperature: TEMPERATURE,
        }),
    });
    const data = (await response.json()) as IResponseData;
    return data;
}


async function getOpenAICompletion(messages: IMessage[]): Promise<IResponseData> {
    const url = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            messages: messages,
            temperature: TEMPERATURE,
            n: 1,
        }),
    });

    const data = await response.json();
    return data as IResponseData;
}
