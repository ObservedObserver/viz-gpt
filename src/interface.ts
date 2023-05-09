export interface IField {
    fid: string;
    semanticType: string;
}

export interface IRow {
    [key: string]: any;
}

export interface IDataset {
    fields: IField[];
    dataSource: IRow[];
}