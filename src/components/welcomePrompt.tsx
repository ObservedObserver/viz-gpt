import { IField } from "../interface";

interface WelcomePromptProps {
    metas: IField[];
    onPromptClick?: (prompt: string) => void;
}
export function WelcomePrompt(props: WelcomePromptProps) {
    const { metas, onPromptClick } = props;
    const measure = metas.find((meta) => meta.semanticType === "quantitative");
    const dimension =
        metas.find((meta) => meta.semanticType === "temporal") ||
        metas.find((meta) => meta.semanticType === "nominal");
    const prompts: string[] = [
        `Show the distribution of ${measure ? measure.fid : metas[0].fid}.`,
        `How ${measure.fid} diffs in ${dimension.fid} ?`,
        `Draw a chart from the data.`,
    ];
    return (
        <div className="mx-auto grid grid-cols-3 py-4 text-sm">
            {prompts.map((prompt, pIndex) => {
                return (
                    <div
                        onClick={() => {
                            if (onPromptClick) {
                                onPromptClick(prompt);
                            }
                        }}
                        key={pIndex}
                        className="border border-gray-200 p-4 m-2 rounded-md text-gray-700 hover:shadow-lg cursor-pointer"
                    >
                        <p>{prompt}</p>
                    </div>
                );
            })}
        </div>
    );
}
