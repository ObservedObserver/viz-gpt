import { IDataset } from "../interface";

export function matchQuote(str: string, left: string, right: string): string | null {
    let stack = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === left) {
            if (stack === 0) {
                start = i;
            }
            stack++;
        }
        if (str[i] === right) {
            stack--;
            if (stack === 0) {
                end = i;
                break;
            }
        }
    }
    if (start !== -1 && end !== -1) {
        return str.substring(start, end + 1);
    }
    return null;
}

type JsonValue = string | number | boolean | null | JsonArray | JsonObject;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = Array<JsonValue>;
type Callback = (key: string, value: JsonValue, node: JsonObject) => void;

function traverseJson(json: JsonValue, callback: Callback, prefix: string, parent: JsonObject | JsonArray | null = null): void {
  if (typeof json === 'object' && json !== null) {
    if (Array.isArray(json)) {
      (json as JsonArray).forEach((value, index) => {
        const newPrefix = `${prefix}[${index}]`;
        traverseJson(value, callback, newPrefix, json);
      });
    } else {
      Object.entries(json as JsonObject).forEach(([key, value]) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        traverseJson(value, callback, newPrefix, json as JsonObject);
      });
    }
  } else {
    if (parent !== null && !Array.isArray(parent)) {
      callback(prefix, json, parent);
    }
  }
}

export function getValidVegaSpec (content: string, dataset: IDataset): object | null {
    const raw = matchQuote(content, '{', '}');
    if (raw) {
        try {
            const spec = JSON.parse(raw);
            traverseJson(spec, (k, v, fieldDef) => {
                // console.log({ k, v, fieldDef })
                if (fieldDef.field) {
                    const fn = (fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin')) as string
                    const field = dataset.fields.find(f => f.name === v);
                    if (!field) {
                        return;
                    }
                    if (fn) {
                        fieldDef.title = `${fn.toUpperCase()}(${field.name})`;
                    } else {
                        fieldDef.title = field.name;
                    }
                    fieldDef.field = field.fid
                }
            }, '')
            return spec
        } catch (e) {
            return null
        }
    }
    return null;
}