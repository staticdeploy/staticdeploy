import sinon, { SinonStub } from "sinon";

import IAppsStorage from "../src/dependencies/IAppsStorage";
import IArchiver from "../src/dependencies/IArchiver";
import IBundlesStorage from "../src/dependencies/IBundlesStorage";
import IEntrypointsStorage from "../src/dependencies/IEntrypointsStorage";
import IOperationLogsStorage from "../src/dependencies/IOperationLogsStorage";
import IRequestContext from "../src/dependencies/IRequestContext";
import IStorages from "../src/dependencies/IStorages";

// Dependencies mock
interface IMockDependencies {
    storages: {
        apps: {
            [method in keyof IAppsStorage]: SinonStub<
                Parameters<IAppsStorage[method]>,
                ReturnType<IAppsStorage[method]>
            >;
        };
        bundles: {
            [method in keyof IBundlesStorage]: SinonStub<
                Parameters<IBundlesStorage[method]>,
                ReturnType<IBundlesStorage[method]>
            >;
        };
        entrypoints: {
            [method in keyof IEntrypointsStorage]: SinonStub<
                Parameters<IEntrypointsStorage[method]>,
                ReturnType<IEntrypointsStorage[method]>
            >;
        };
        operationLogs: {
            [method in keyof IOperationLogsStorage]: SinonStub<
                Parameters<IOperationLogsStorage[method]>,
                ReturnType<IOperationLogsStorage[method]>
            >;
        };
        checkHealth: SinonStub<
            Parameters<IStorages["checkHealth"]>,
            ReturnType<IStorages["checkHealth"]>
        >;
    };
    requestContext: IRequestContext;
    archiver: {
        [method in keyof IArchiver]: SinonStub<
            Parameters<IArchiver[method]>,
            ReturnType<IArchiver[method]>
        >;
    };
}
export function getMockDependencies(): IMockDependencies {
    return {
        storages: {
            apps: {
                findOne: sinon.stub(),
                findOneByName: sinon.stub(),
                findMany: sinon.stub(),
                createOne: sinon.stub(),
                updateOne: sinon.stub(),
                deleteOne: sinon.stub()
            },
            bundles: {
                findOne: sinon.stub(),
                findLatestByNameAndTag: sinon.stub(),
                getBundleAssetContent: sinon.stub(),
                findMany: sinon.stub(),
                findManyByNameAndTag: sinon.stub(),
                findManyNames: sinon.stub(),
                findManyTagsByName: sinon.stub(),
                createOne: sinon.stub(),
                deleteOne: sinon.stub(),
                deleteMany: sinon.stub()
            },
            entrypoints: {
                findOne: sinon.stub(),
                findOneByUrlMatcher: sinon.stub(),
                findManyByAppId: sinon.stub(),
                findManyByBundleId: sinon.stub(),
                findManyByBundleIds: sinon.stub(),
                findManyByUrlMatcherHostname: sinon.stub(),
                createOne: sinon.stub(),
                updateOne: sinon.stub(),
                deleteOne: sinon.stub(),
                deleteManyByAppId: sinon.stub()
            },
            operationLogs: {
                findMany: sinon.stub(),
                createOne: sinon.stub()
            },
            checkHealth: sinon.stub()
        },
        requestContext: {
            userId: "userId"
        },
        archiver: {
            extractFiles: sinon.stub(),
            makeArchive: sinon.stub()
        }
    };
}
