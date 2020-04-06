import { IConfiguration } from "@staticdeploy/core";
import set from "lodash/set";

export interface IKVPair {
    key: string;
    value: string;
}

export function fromKVPairs(kvPairs: IKVPair[]): IConfiguration {
    const config: IConfiguration = {};
    kvPairs.forEach(({ key, value }) => (config[key] = value));
    return config;
}

export function toKVPairs(config: IConfiguration): IKVPair[] {
    return Object.entries(config).map(([key, value]) => ({ key, value }));
}

interface IDuplicateKey {
    key: string;
    indexes: number[];
}
function getDuplicateKeys(kvPairs: IKVPair[]): IDuplicateKey[] {
    const keyIndexes: { [key: string]: number[] } = {};
    kvPairs.forEach(({ key }, index) => {
        keyIndexes[key] = (keyIndexes[key] || []).concat(index);
    });
    return Object.entries(keyIndexes)
        .filter(([_, indexes]) => indexes.length !== 1)
        .map(([key, indexes]) => ({ key, indexes }));
}
export function getErrors(kvPairs?: IKVPair[]): any[] | undefined {
    const errors: any[] = [];
    if (!kvPairs) {
        return undefined;
    }
    getDuplicateKeys(kvPairs).forEach(({ indexes }) => {
        indexes.forEach((index) => {
            set(errors, `[${index}].key`, "Duplicate");
        });
    });
    kvPairs.forEach(({ key }, index) => {
        if (!key) {
            set(errors, `[${index}].key`, "Required");
        }
    });
    return errors.length ? errors : undefined;
}
