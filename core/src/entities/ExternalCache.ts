import { every, isPlainObject, isString } from "lodash";

import {
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError
} from "../common/errors";
import isFQDN from "validator/lib/isFQDN";

export interface IExternalCache {
    id: string;
    domain: string;
    type: string;
    configuration: {
        [key: string]: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export function isExternalCacheDomainValid(domain: string): boolean {
    return isFQDN(domain);
}
export function validateExternalCacheDomain(domain: string): void {
    if (!isExternalCacheDomainValid(domain)) {
        throw new ExternalCacheDomainNotValidError(domain);
    }
}

/*
 *  A valid external cache configuration object is a (string, string) dictionary
 */
export function isExternalCacheConfigurationValid(configuration: any): boolean {
    return isPlainObject(configuration) && every(configuration, isString);
}
export function validateExternalCacheConfiguration(configuration: any): void {
    if (!isExternalCacheConfigurationValid(configuration)) {
        throw new ExternalCacheConfigurationNotValidError();
    }
}
