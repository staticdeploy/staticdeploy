import {
    every,
    find,
    isEqual,
    isPlainObject,
    isString,
    keys,
    map
} from "lodash";
import isFQDN from "validator/lib/isFQDN";

import {
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError,
    ExternalCacheTypeNotSupportedError
} from "../common/errors";

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

export interface IExternalCacheType {
    name: string;
    label: string;
    configurationFields: {
        name: string;
        label: string;
        placeholder: string;
    }[];
}

export function getMatchingExternalCacheType(
    externalCacheTypes: IExternalCacheType[],
    type: string
): IExternalCacheType | null {
    return find(externalCacheTypes, { name: type }) || null;
}

/*
 *  An external cache type is valid when there is a supported external cache
 *  type matching it
 */
export function isExternalCacheTypeSupported(
    type: string,
    supportedExternalCacheTypes: IExternalCacheType[]
): boolean {
    return !!getMatchingExternalCacheType(supportedExternalCacheTypes, type);
}
export function validateExternalCacheType(
    type: string,
    supportedExternalCacheTypes: IExternalCacheType[]
): void {
    if (!isExternalCacheTypeSupported(type, supportedExternalCacheTypes)) {
        throw new ExternalCacheTypeNotSupportedError(type);
    }
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
 *  whose fields match the configurationField-s defined in the externalCacheType
 */
export function isExternalCacheConfigurationValid(
    configuration: any,
    externalCacheType: IExternalCacheType
): boolean {
    return (
        isPlainObject(configuration) &&
        every(configuration, isString) &&
        isEqual(
            map(externalCacheType.configurationFields, "name"),
            keys(configuration)
        )
    );
}
export function validateExternalCacheConfiguration(
    configuration: any,
    externalCacheType: IExternalCacheType
): void {
    if (!isExternalCacheConfigurationValid(configuration, externalCacheType)) {
        throw new ExternalCacheConfigurationNotValidError();
    }
}
