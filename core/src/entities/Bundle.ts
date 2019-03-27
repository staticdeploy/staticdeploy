import basicCharsRegexp from "../common/basicCharsRegexp";
import {
    BundleNameOrTagNotValidError,
    BundleNameTagCombinationNotValidError
} from "../common/errors";
import { IAsset, IAssetWithoutContent } from "./Asset";

export interface IBundle {
    id: string;
    name: string;
    tag: string;
    description: string;
    hash: string;
    assets: IAsset[];
    fallbackAssetPath: string;
    fallbackStatusCode: number;
    createdAt: Date;
}

export interface IBundleWithoutAssetsContent extends IBundle {
    assets: IAssetWithoutContent[];
}

export interface IBaseBundle {
    id: IBundle["id"];
    name: IBundle["name"];
    tag: IBundle["tag"];
    createdAt: IBundle["createdAt"];
}

/*
 *  Bundle name and tag strings have the same validation rules:
 *  - 0 < length < 256
 *  - allowed characters are the ones from the basicChars subset specified above
 */
export function isBundleNameOrTagValid(nameOrTag: string): boolean {
    return basicCharsRegexp.test(nameOrTag);
}
export function validateBundleNameOrTag(
    nameOrTag: string,
    type: "name" | "tag"
): void {
    if (!isBundleNameOrTagValid(nameOrTag)) {
        throw new BundleNameOrTagNotValidError(nameOrTag, type);
    }
}

/*
 *  A bundle name:tag combination is a string joining name and tag with a colon
 *  character (:)
 */

export function isBundleNameTagCombinationValid(
    nameTagCombination: string
): boolean {
    const segments = nameTagCombination.split(":");
    if (segments.length !== 2) {
        return false;
    }
    const [name, tag] = segments;
    return isBundleNameOrTagValid(name) && isBundleNameOrTagValid(tag);
}
export function validateBundleNameTagCombination(
    nameTagCombination: string
): void {
    if (!isBundleNameTagCombinationValid(nameTagCombination)) {
        throw new BundleNameTagCombinationNotValidError(nameTagCombination);
    }
}

/*
 *  Utility functions for nameTag combinations
 */
export function formNameTagCombination(name: string, tag: string): string {
    return `${name}:${tag}`;
}
export function splitNameTagCombination(
    nameTagCombination: string
): [string, string] {
    validateBundleNameTagCombination(nameTagCombination);
    return nameTagCombination.split(":") as [string, string];
}
