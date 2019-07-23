import basicCharsRegexp from "../common/basicCharsRegexp";
import { AppNameNotValidError } from "../common/errors";
import { IConfiguration } from "./Configuration";

export interface IApp {
    id: string;
    name: string;
    defaultConfiguration: IConfiguration;
    createdAt: Date;
    updatedAt: Date;
}

/*
 *  An app name is valid when:
 *  - has 0 < length < 256
 *  - contains only characters from the basicChars subset (see utils)
 */
export function isAppNameValid(name: string): boolean {
    return basicCharsRegexp.test(name);
}
export function validateAppName(name: string): void {
    if (!isAppNameValid(name)) {
        throw new AppNameNotValidError(name);
    }
}
