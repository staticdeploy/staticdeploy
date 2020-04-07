import { omitBy } from "lodash";

export default function removeUndefs(obj: {
    [key: string]: any | undefined;
}): { [key: string]: any } {
    return omitBy(obj, (value) => value === undefined) as {
        [key: string]: any;
    };
}
