import faker from "faker";
import { lowerCase, pick, range } from "lodash";

const id = () => faker.random.alphaNumeric(8);

// Apps
export const app = (supplied: any = {}) => ({
    id: id(),
    name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
    defaultConfiguration: { KEY: "VALUE" },
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...supplied
});

// Bundles
export const bundleName = () => faker.random.word();
export const bundleTag = () => faker.lorem.word();
export const bundle = (supplied: any = {}) => ({
    id: id(),
    hash: faker.random.alphaNumeric(255),
    name: bundleName(),
    tag: bundleTag(),
    description: faker.lorem.sentence(8),
    assets: [
        { path: "/index.html", mimeType: "text/html" },
        { path: "/js/index.js", mimeType: "application/js" },
        { path: "/css/index.css", mimeType: "text/css" }
    ],
    fallbackAssetPath: faker.random.arrayElement(["/index.html", "/404.html"]),
    fallbackStatusCode: faker.random.arrayElement([404, 200]),
    createdAt: faker.date.past(),
    ...supplied
});
export const baseBundle = () =>
    pick(bundle(), ["id", "name", "tag", "createdAt"]);

export const times = (n: number, generator: () => any) =>
    range(n).map(generator);

// Entrypoints
export const entrypoint = (supplied: any = {}) => ({
    id: id(),
    appId: id(),
    urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}/`,
    bundleId: Math.random() > 0.5 ? id() : null,
    redirectTo: Math.random() > 0.5 ? faker.internet.url() : null,
    configuration: Math.random() > 0.5 ? { KEY: "VALUE" } : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...supplied
});

// External caches
export const externalCache = (supplied: any = {}) => {
    const type = faker.random.arrayElement(["AWS_CLOUDFRONT", "AZURE_CDN"]);
    return {
        id: id(),
        domain: faker.internet.domainName(),
        type: type,
        configuration:
            type === "AWS_CLOUDFRONT"
                ? {
                      ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE",
                      SECRET_ACCESS_KEY:
                          "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKE",
                      CLOUDFRONT_DISTRIBUTION_ID: "EDFDVBD6EXAMPLE"
                  }
                : {
                      SERVICE_PRINCIPAL_USERNAME: "Username",
                      SERVICE_PRINCIPAL_PASSWORD: "Password",
                      SUBSCRIPTION_ID: "3a6f930e-e2bb-4420-aa6e-d7c9ae5dda0c",
                      RESOURCE_GROUP_NAME: "resource-group-name",
                      CDN_PROFILE_NAME: "cdn-profile-name",
                      CDN_ENDPOINT_NAME: "cdn-endpoint-name"
                  },
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        ...supplied
    };
};
export const externalCacheTypes = () => [
    {
        name: "AWS_CLOUDFRONT",
        label: "AWS CloudFront",
        configurationFields: [
            {
                name: "ACCESS_KEY_ID",
                label: "Access Key Id",
                placeholder: "AKIAIOSFODNN7EXAMPLE"
            },
            {
                name: "SECRET_ACCESS_KEY",
                label: "Secret Access Key",
                placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            },
            {
                name: "CLOUDFRONT_DISTRIBUTION_ID",
                label: "CloudFront Distribution Id",
                placeholder: "EDFDVBD6EXAMPLE"
            }
        ]
    },
    {
        name: "AZURE_CDN",
        label: "Azure CDN",
        configurationFields: [
            {
                name: "SERVICE_PRINCIPAL_USERNAME",
                label: "Service Principal Username",
                placeholder: "Username"
            },
            {
                name: "SERVICE_PRINCIPAL_PASSWORD",
                label: "Service Principal Password",
                placeholder: "Password"
            },
            {
                name: "SUBSCRIPTION_ID",
                label: "Subscription Id",
                placeholder: "3a6f930e-e2bb-4420-aa6e-d7c9ae5dda0c"
            },
            {
                name: "RESOURCE_GROUP_NAME",
                label: "Resource Group Name",
                placeholder: "resource-group-name"
            },
            {
                name: "CDN_PROFILE_NAME",
                label: "CDN Profile Name",
                placeholder: "cdn-profile-name"
            },
            {
                name: "CDN_ENDPOINT_NAME",
                label: "CDN Endpoint Name",
                placeholder: "cdn-endpoint-name"
            }
        ]
    }
];

// Groups
export const group = (supplied: any = {}) => ({
    id: id(),
    name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
    roles: times(3, () =>
        faker.random.arrayElement([
            "root",
            `app-manager:${id()}`,
            `bundle-manager:${id()}`,
            `entrypoint-creator:${id()}`,
            `entrypoint-manager:${id()}`
        ])
    ),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...supplied
});

// Operation logs
export const operationLog = () => ({
    id: id(),
    operation: faker.random.arrayElement([
        "apps:create",
        "apps:update",
        "apps:delete",
        "entrypoints:create",
        "entrypoints:update",
        "entrypoints:delete",
        "bundles:create",
        "bundles:delete"
    ]),
    parameters: {
        oldApp: { name: "oldApp" },
        newApp: { name: "newApp" }
    },
    performedBy: id(),
    performedAt: faker.date.past()
});

// Users
export const user = (supplied: any = {}) => ({
    id: id(),
    idp: faker.internet.domainName(),
    idpId: id(),
    type: faker.random.arrayElement(["human", "machine"]),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...supplied
});
export const userWithGroups = (supplied: any = {}) =>
    user({ groups: times(5, group), ...supplied });
