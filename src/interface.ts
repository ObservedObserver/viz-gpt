export type ISemanticType = 'quantitative' | 'nominal' | 'ordinal' | 'temporal';

export interface IField {
    fid: string;
    semanticType: ISemanticType;
}

export interface IRow {
    [key: string]: any;
}

export interface IDataset {
    fields: IField[];
    dataSource: IRow[];
}