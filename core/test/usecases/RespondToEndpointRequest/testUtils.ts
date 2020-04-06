import { expect } from "chai";
import { load } from "cheerio";
import { compact, isNil, keys, map, reduce } from "lodash";
import { isMatch } from "micromatch";
import { getType } from "mime";
import { join } from "path";
import { VM } from "vm2";

import { IAsset } from "../../../src/entities/Asset";
import { IConfiguration } from "../../../src/entities/Configuration";
import { IEndpointResponse } from "../../../src/entities/EndpointResponse";
import { IEntrypoint } from "../../../src/entities/Entrypoint";
import RespondToEndpointRequest from "../../../src/usecases/RespondToEndpointRequest";
import { getMockDependencies } from "../../testUtils";

// Extracts the json APP_CONFIG object from a configured html
export function extractAppConfig(body: string) {
    const $ = load(body);
    const scriptContent = $("script#app-config").html();
    const vm = new VM({ sandbox: { window: {} } });
    vm.run(scriptContent!);
    return vm.run("window.APP_CONFIG");
}

// Wraps a string into an HTML envelope
export function htmlWith(body: string): string {
    return `<html><head></head><body>${escape(body)}</body></html>`;
}

// Register mocha tests from a test definition. A test definition corresponds to
// a mocha 'describe' block. Each test case of a test definition correspond to a
// mocha 'it' block
export interface ITestDefinition {
    only?: boolean;
    entrypoints: {
        urlMatcher: string;
        redirectTo?: string;
        configuration?: IConfiguration;
        bundleContent?: IFsDefinition;
        bundleFallbackAssetPath?: string;
        bundleFallbackStatusCode?: number;
        bundleHeaders?: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
        defaultConfiguration?: IConfiguration;
    }[];
    testCases: {
        only?: boolean;
        requestedUrl: string;
        expectedError?: any;
        expectedStatusCode?: number;
        expectedLocationHeader?: string;
        expectedMimeTypeHeader?: string;
        expectedHeaders?:
            | IAsset["headers"]
            | ((headers: IAsset["headers"]) => void);
        expectedBody?: string | ((body: string) => void);
    }[];
}
export function test(description: string, testDefinition: ITestDefinition) {
    const { entrypoints, testCases } = testDefinition;

    // Support only running one definition
    const describeFn = testDefinition.only ? describe.only : describe;

    // Mock dependencies so that they behave according to the supplied
    // entrypoints configuration. The methods to mock used by the usecase are:
    //
    //   - storages.entrypoints.findManyByUrlMatcherHostname(request.hostname)
    //   - storages.bundles.findOne(matchingEntrypoint.bundleId)
    //   - storages.bundles.getBundleAssetContent(linkedBundle.id, matchingAsset.path)
    //   - storages.apps.findOne(matchingEntrypoint.appId)
    const deps = getMockDependencies();
    const mockEntrypoints: IEntrypoint[] = [];
    entrypoints.forEach((entrypoint, index) => {
        // The same id is used for:
        //   - the mock entrypoint
        //   - the mock app linked to the mock entrypoint
        //   - if present, the mock bundle linked to the mock entrypoint
        const id = index.toString();
        const hasLinkedBundle =
            !!entrypoint.bundleContent && !!entrypoint.bundleFallbackAssetPath;

        // Mock the linked app
        deps.storages.apps.findOne.withArgs(id).resolves({
            id: id,
            name: "name",
            defaultConfiguration: entrypoint.defaultConfiguration || {},
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock the linked bundle and assets
        if (hasLinkedBundle) {
            const assets = toFiles(entrypoint.bundleContent!).map((file) => {
                // Replicate the logic to build the assets list from the
                // CreateBundle usecase
                return {
                    path: file.path,
                    mimeType: getType(file.path) || "application/octet-stream",
                    content: file.content,
                    headers: reduce(
                        entrypoint.bundleHeaders || {},
                        (finalHeaders, headers, assetMatcher) => ({
                            ...finalHeaders,
                            ...(isMatch(file.path, assetMatcher)
                                ? headers
                                : null),
                        }),
                        {}
                    ),
                };
            });
            deps.storages.bundles.findOne.withArgs(id).resolves({
                id: id,
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: assets.map((asset) => ({
                    ...asset,
                    content: undefined,
                })),
                fallbackAssetPath: entrypoint.bundleFallbackAssetPath!,
                fallbackStatusCode: entrypoint.bundleFallbackStatusCode || 200,
                createdAt: new Date(),
            });
            assets.forEach((asset) => {
                deps.storages.bundles.getBundleAssetContent
                    .withArgs(id, asset.path)
                    .resolves(asset.content);
            });
        }

        // Add a mocked entrypoint
        mockEntrypoints.push({
            id: id,
            urlMatcher: entrypoint.urlMatcher,
            appId: id,
            bundleId: hasLinkedBundle ? id : null,
            redirectTo: entrypoint.redirectTo || null,
            configuration: entrypoint.configuration || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });
    // Mock the entrypoints
    deps.storages.entrypoints.findManyByUrlMatcherHostname.resolves(
        mockEntrypoints
    );

    // Execute test cases and run assertions
    describeFn(description, () => {
        testCases.forEach((testCase) => {
            const {
                requestedUrl,
                expectedError,
                expectedLocationHeader,
                expectedBody,
                expectedStatusCode,
                expectedMimeTypeHeader,
                expectedHeaders,
            } = testCase;

            // Support only running one test case
            const itFn = testCase.only ? it.only : it;

            // Build the test case description
            const itDescription = compact([
                "case:",
                !isNil(expectedError) && `throws ${expectedError.name}`,
                !isNil(expectedStatusCode) && expectedStatusCode,
                !isNil(expectedLocationHeader) && "and correct location",
                !isNil(expectedMimeTypeHeader) && "and correct mime-type",
                !isNil(expectedHeaders) && "and correct headers",
                !isNil(expectedBody) && "and correct body",
                "when requesting",
                requestedUrl,
            ]).join(" ");

            itFn(itDescription, async () => {
                // Execute the use case
                const respondToEndpointRequest = new RespondToEndpointRequest(
                    deps
                );
                const firstSlash = requestedUrl.indexOf("/");
                const responsePromise = respondToEndpointRequest.exec({
                    hostname: requestedUrl.slice(0, firstSlash),
                    path: requestedUrl.slice(firstSlash),
                });
                let response: IEndpointResponse;

                // Run assertions on the response
                if (expectedError) {
                    await expect(responsePromise).to.be.rejectedWith(
                        expectedError
                    );
                } else {
                    response = await responsePromise;
                    if (expectedStatusCode) {
                        expect(response)
                            .to.have.property("statusCode")
                            .that.equals(expectedStatusCode);
                    }
                    if (expectedLocationHeader) {
                        expect(response)
                            .to.have.nested.property("headers.location")
                            .that.equals(expectedLocationHeader);
                    }
                    if (expectedMimeTypeHeader) {
                        expect(response)
                            .to.have.property("nested.mime-type")
                            .that.equals(expectedMimeTypeHeader);
                    }
                    if (expectedHeaders) {
                        if (typeof expectedHeaders === "function") {
                            expect(response).to.have.property("headers");
                            expectedHeaders(response.headers);
                        } else {
                            expect(response)
                                .to.have.property("headers")
                                .that.deep.equals(expectedHeaders);
                        }
                    }
                    if (expectedBody) {
                        if (typeof expectedBody === "function") {
                            expect(response)
                                .to.have.property("body")
                                .that.is.an.instanceOf(Buffer);
                            expectedBody(response.body!.toString());
                        } else {
                            expect(response)
                                .to.have.property("body")
                                .that.deep.equals(Buffer.from(expectedBody));
                        }
                    }
                }
            });
        });
    });
}

// The test case supplies the bundle content as an IFsDefinition (which is a
// very clear and understandable representation). This functions turns it into a
// flat list of files
interface IFsDefinition {
    [pathSegment: string]: string | IFsDefinition;
}
interface IFile {
    path: string;
    content: Buffer;
}
function toFiles(fsDefinition: IFsDefinition): IFile[] {
    return map(flattenFsDefinition(fsDefinition), (content, path) => ({
        path: path,
        content: Buffer.from(content),
    }));
}

interface IFlatFsDefinition {
    [fullPath: string]: string;
}
function flattenFsDefinition(
    fsDefinition: IFsDefinition,
    parentPath = "/"
): IFlatFsDefinition {
    const flatFsDefinition: IFlatFsDefinition = {};
    keys(fsDefinition)
        .sort()
        .reverse()
        .forEach((segment) => {
            const value = fsDefinition[segment];
            const path = join(parentPath, segment);
            if (typeof value === "string") {
                flatFsDefinition[path] = value;
            } else {
                Object.assign(
                    flatFsDefinition,
                    flattenFsDefinition(value, path)
                );
            }
        });
    return flatFsDefinition;
}
