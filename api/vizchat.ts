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

export default async function (req: VercelRequest, res: VercelResponse) {
    const { messages, metas } = req.body as RequestBody;
    const systemMessage: IMessage = {
        role: "system",
        content: `You are a great assistant at vega-lite visualization creation. No matter what the user ask, you should always response with a valid vega-lite specification in JSON.

            You should create the vega-lite specification based on user's query, do not contains key of data. Here is the instructions:

            Besides, Here are some requirements:
            1. do not contains key of data.
            2. if the user ask many times, you should generate the specification based on the previous context.
            3. You should consider to aggregate the field if it is quantitative and the chart has a mark type of react, bar, line, area or arc.
            4. the available fields in the dataset and their types are:
            ${metas
                .map((field) => `${field.fid} (${field.semanticType})`)
                .join(", ")}
            `,
    };
    try {
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
                messages: [systemMessage, ...messages],
            }),
        });
        const data = (await response.json()) as IResponseData;
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
