import every from "lodash/every";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";

import { ConfigurationNotValidError } from "../common/errors";

export interface IConfiguration {
    [key: string]: string;
}

/*
 *  A valid configuration object is a (string, string) dictionary
 */
export function isConfigurationValid(
    configuration: any
): configuration is IConfiguration {
    return isPlainObject(configuration) && every(configuration, isString);
}
export function validateConfiguration(
    configuration: any,
    configurationProperty: string
): void {
    if (!isConfigurationValid(configuration)) {
        throw new ConfigurationNotValidError(configurationProperty);
    }
}
