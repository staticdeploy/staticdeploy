import { AxiosResponse } from "axios";
import isArray from "lodash/isArray";

function parseObjectDates(obj: any) {
    if (obj && obj.createdAt) {
        obj.createdAt = new Date(obj.createdAt);
    }
    if (obj && obj.updatedAt) {
        obj.updatedAt = new Date(obj.updatedAt);
    }
    if (obj && obj.deletedAt) {
        obj.deletedAt = new Date(obj.deletedAt);
    }
    if (obj && obj.performedAt) {
        obj.performedAt = new Date(obj.performedAt);
    }
    return obj;
}

export default function parseDates() {
    return (response: AxiosResponse) => {
        return {
            ...response,
            data: isArray(response.data)
                ? response.data.map(parseObjectDates)
                : parseObjectDates(response.data),
        };
    };
}
