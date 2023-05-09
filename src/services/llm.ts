import { IField } from "../interface";

export interface IMessage {
    role: string;
    content: string;
}
export interface IResponse {
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

export async function chatCompletation(
    messages: IMessage[], metas: IField[]
): Promise<IResponse> {
    const url = `/api/vizchat`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages,
            metas
        }),
    });
    const result = (await res.json()) as {
        data: IResponse;
        success: boolean;
        message?: string;
    };
    if (result.success) {
        return result.data;
    } else {
        throw new Error(result.message ?? "Unknown error");
    }
}
