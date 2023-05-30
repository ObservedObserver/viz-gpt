import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { IField, IRow } from "../../interface";
import Pagination from "./pagination";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import DropdownContext from "../dropdownContext"

interface DataTableProps {
    size?: number;
    metas: IField[];
    data: IRow[];
    onMetaChange: (fid: string, fIndex: number, meta: Partial<IField>) => void;
}
const Container = styled.div`
    overflow-x: auto;
    max-height: 660px;
    overflow-y: auto;
    table {
        box-sizing: content-box;
        border-collapse: collapse;
        font-size: 12px;
        tbody {
            td {
            }
            td.number {
                text-align: right;
            }
            td.text {
                text-align: left;
            }
        }
    }
`;
const SEMANTIC_TYPE_LIST = ["nominal", "ordinal", "quantitative", "temporal"];
// function getCellType(field: IField): 'number' | 'text' {
//     return field.dataType === 'number' || field.dataType === 'integer' ? 'number' : 'text';
// }
function getHeaderType(field: IField): "number" | "text" {
    return field.semanticType !== "quantitative" ? "text" : "number";
}

function getHeaderClassNames(field: IField) {
    return field.semanticType !== "quantitative" ? "border-t-4 border-blue-400" : "border-t-4 border-purple-400";
}

function getSemanticColors(field: IField): string {
    switch (field.semanticType) {
        case "nominal":
            return "border border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100 dark:border-sky-600";
        case "ordinal":
            return "border border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-600";
        case "quantitative":
            return "border border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-600";
        case "temporal":
            return "border border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-600";
        default:
            return "border border-transparent bg-gray-400";
    }
}

const DataTable: React.FC<DataTableProps> = (props) => {
    const { size = 10, data, metas, onMetaChange } = props;
    const [pageIndex, setPageIndex] = useState(0);

    const semanticTypeList = useMemo<{ value: string; label: string }[]>(() => {
        return SEMANTIC_TYPE_LIST.map((st) => ({
            value: st,
            label: st
        }));
    }, []);

    const from = pageIndex * size;
    const to = Math.min((pageIndex + 1) * size, data.length - 1);

    return (
        <Container className="rounded border-gray-200 dark:border-gray-700 border">
            <Pagination
                total={data.length}
                from={from + 1}
                to={to + 1}
                onNext={() => {
                    setPageIndex(Math.min(Math.ceil(data.length / size) - 1, pageIndex + 1));
                }}
                onPrev={() => {
                    setPageIndex(Math.max(0, pageIndex - 1));
                }}
            />
            <table className="min-w-full divide-y">
                <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className="divide-x divide-gray-200 dark:divide-gray-700">
                        {metas.map((field, fIndex) => (
                            <th key={field.fid} className={""}>
                                <div
                                    className={
                                        getHeaderClassNames(field) +
                                        " whitespace-nowrap py-3.5 px-6 text-left text-xs font-semibold text-gray-900 dark:text-gray-50 sm:pl-6"
                                    }
                                >
                                    <b>{field.name || field.fid}</b>
                                    <div>
                                        <DropdownContext
                                            options={semanticTypeList}
                                            onSelect={(value) => {
                                                onMetaChange(field.fid, fIndex, {
                                                    semanticType: value as IField["semanticType"],
                                                });
                                            }}
                                        >
                                            <span
                                                className={
                                                    "cursor-pointer inline-flex px-2.5 py-0.5 text-xs font-medium mt-1 rounded-full text-xs " +
                                                    getSemanticColors(field)
                                                }
                                            >
                                                {field.semanticType}
                                                <ChevronUpDownIcon className="ml-2 w-3" />
                                            </span>
                                        </DropdownContext>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-zinc-900">
                    {data.slice(from, to + 1).map((row, index) => (
                        <tr className={"divide-x divide-gray-200 dark:divide-gray-700 " + (index % 2 ? "bg-gray-50 dark:bg-gray-900" : "")} key={index}>
                            {metas.map((field) => (
                                <td
                                    key={field.fid + index}
                                    className={
                                        getHeaderType(field) +
                                        " whitespace-nowrap py-2 pl-4 pr-3 text-xs text-gray-500 dark:text-gray-300 sm:pl-6"
                                    }
                                >
                                    {`${row[field.fid]}`}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
};

export default DataTable;
