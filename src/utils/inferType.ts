import { IDataset, IField, IRow, ISemanticType } from "../interface";

const COMMON_TIME_FORMAT: RegExp[] = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{4}\.\d{2}\.\d{2}$/, // YYYY.MM.DD
    /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:MM:SS
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, // YYYY-MM-DDTHH:MM:SS (ISO-8601)
];

/**
 * check if this array is a date time array based on some common date format
 * @param data string array
 * @returns
 */
export function isDateTimeArray(data: string[]): boolean {
    let isDateTime = true;
    for (const d of data) {
        let isDateTimeItem = false;
        for (const r of COMMON_TIME_FORMAT) {
            if (r.test(d)) {
                isDateTimeItem = true;
                break;
            }
        }
        if (!isDateTimeItem) {
            isDateTime = false;
            break;
        }
    }
    return isDateTime;
}

export function isNumericArray(data: any[]): boolean {
    return data.every((item) => {
        // Check if the item is already a number
        if (typeof item === 'number') {
            return true;
        }

        // Check if the item can be converted into a number
        const number = parseFloat(item);
        return !isNaN(number) && isFinite(item);
    });
}

export function inferSemanticType(data: IRow[], fid: string): ISemanticType {
    const values = data.map((row) => row[fid]);

    let st: ISemanticType = isNumericArray(values) ? 'quantitative' : 'nominal';
    if (st === 'nominal') {
        if (isDateTimeArray(data.map((row) => `${row[fid]}`))) st = 'temporal';
    }
    return st;
}

export function inferDatasetMeta (data: IRow[]): IDataset {
    if (data.length === 0) {
        return {
            fields: [],
            dataSource: data
        }
    }
    const keys = Object.keys(data[0])
    const fields: IField[] = keys.map(key => {
        const semanticType = inferSemanticType(data, key)
        return {
            fid: key,
            name: key,
            semanticType: semanticType
        }
    })
    return {
        fields,
        dataSource: data
    }
}