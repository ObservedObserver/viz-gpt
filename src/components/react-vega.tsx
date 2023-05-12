import { useEffect, useRef } from "react";
import embed, { vega } from 'vega-embed';
import { IRow } from "../interface";
import { VegaTheme, useCurrentMediaTheme } from "../theme";

interface ReactVegaProps {
    spec: any;
    data?: IRow[];
}

const ReactVega: React.FC<ReactVegaProps> = ({ spec, data }) => {
    const container = useRef<HTMLDivElement>(null);

    const theme = useCurrentMediaTheme();

    useEffect(() => {
        if (container.current && data) {
            spec.data = {
                name: 'dataSource'
            }
            embed(container.current, spec, { actions: false, config: VegaTheme[theme] }).then(res => {
                res.view.change('dataSource', vega.changeset().remove(() => true).insert(data))
                res.view.resize();
                res.view.runAsync();
            })
        }
    }, [spec, data, theme])
    return <div ref={container}></div>
};

export default ReactVega;