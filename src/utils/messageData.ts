import { useEffect } from "react";
import { IDataset, IField, IRow } from "../interface";

interface IDataMessage {
    data: IRow[];
    metas: IField[];
}
export function useMessageData (datasetCreateHandler: (ds: IDataset) => void) {
    useEffect(() => {
        const handler = (ev: MessageEvent<IDataMessage>) => {
            const msg = ev.data;
            const { data, metas } = msg;
            if (data instanceof Array && metas instanceof Array) {
                datasetCreateHandler({
                    dataSource: data,
                    fields: metas.map(f => ({
                        fid: f.fid,
                        name: f.name ?? f.fid,
                        semanticType: f.semanticType
                    }))
                })
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ev.source.postMessage(true, ev.origin)
            }
            

        }
        window.addEventListener('message', handler);
        return () => {
            window.removeEventListener('message', handler)
        }
    }, [datasetCreateHandler])
}