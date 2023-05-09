/* eslint-disable @typescript-eslint/ban-ts-comment */
import { VercelRequest, VercelResponse } from "@vercel/node";
import { IMessage } from "../src/services/llm";
import fetch from "node-fetch";

interface RequestBody {
    messages: IMessage[];
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
    const { messages } = req.body as RequestBody;
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
                messages,
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
