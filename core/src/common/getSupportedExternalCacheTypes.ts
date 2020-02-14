import { map } from "lodash";

import IExternalCacheService from "../dependencies/IExternalCacheService";
import { IExternalCacheType } from "../entities/ExternalCache";

export default function getSupportedExternalCacheTypes(
    externalCacheServices: IExternalCacheService[]
): IExternalCacheType[] {
    return map(externalCacheServices, "externalCacheType");
}
