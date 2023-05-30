export type ISemanticType = 'quantitative' | 'nominal' | 'ordinal' | 'temporal';

export interface IField {
    fid: string;
    name: string;
    semanticType: ISemanticType;
}

export interface IRow {
    [key: string]: any;
}

export interface IDataset {
    fields: IField[];
    dataSource: IRow[];
}
export type IDarkMode = 'media' | 'light' | 'dark';
