import { useEffect, useRef } from "react";
import embed, { vega } from 'vega-embed';
import { IRow } from "../interface";

interface ReactVegaProps {
    spec: any;
    data?: IRow[];
}

const ReactVega: React.FC<ReactVegaProps> = ({ spec, data }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current && data) {
            spec.data = {
                name: 'dataSource'
            }
            embed(container.current, spec, { actions: false }).then(res => {
                res.view.change('dataSource', vega.changeset().remove(() => true).insert(data))
                res.view.resize();
                res.view.runAsync();
            })
        }
    }, [spec, data])
    return <div ref={container}></div>
};

export default ReactVega;