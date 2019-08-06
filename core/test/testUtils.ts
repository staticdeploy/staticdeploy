import sinon, { SinonStub } from "sinon";

import IAppsStorage from "../src/dependencies/IAppsStorage";
import IArchiver from "../src/dependencies/IArchiver";
import IBundlesStorage from "../src/dependencies/IBundlesStorage";
import IEntrypointsStorage from "../src/dependencies/IEntrypointsStorage";
import IGroupsStorage from "../src/dependencies/IGroupsStorage";
import IOperationLogsStorage from "../src/dependencies/IOperationLogsStorage";
import IRequestContext from "../src/dependencies/IRequestContext";
import IStorages from "../src/dependencies/IStorages";
import IUsecaseConfig, {
    AuthEnforcementLevel
} from "../src/dependencies/IUsecaseConfig";
import IUsersStorage from "../src/dependencies/IUsersStorage";

// Dependencies mock
interface IMockDependencies {
    archiver: {
        [method in keyof IArchiver]: SinonStub<
            Parameters<IArchiver[method]>,
            ReturnType<IArchiver[method]>
        >;
    };
    config: IUsecaseConfig;
    requestContext: IRequestContext;
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
        groups: {
            [method in keyof IGroupsStorage]: SinonStub<
                Parameters<IGroupsStorage[method]>,
                ReturnType<IGroupsStorage[method]>
            >;
        };
        operationLogs: {
            [method in keyof IOperationLogsStorage]: SinonStub<
                Parameters<IOperationLogsStorage[method]>,
                ReturnType<IOperationLogsStorage[method]>
            >;
        };
        users: {
            [method in keyof IUsersStorage]: SinonStub<
                Parameters<IUsersStorage[method]>,
                ReturnType<IUsersStorage[method]>
            >;
        };
        checkHealth: SinonStub<
            Parameters<IStorages["checkHealth"]>,
            ReturnType<IStorages["checkHealth"]>
        >;
    };
}
export function getMockDependencies(): IMockDependencies {
    return {
        archiver: {
            extractFiles: sinon.stub(),
            makeArchive: sinon.stub()
        },
        config: {
            authEnforcementLevel: AuthEnforcementLevel.None
        },
        requestContext: {
            idpUser: null
        },
        storages: {
            apps: {
                findOne: sinon.stub(),
                findOneByName: sinon.stub(),
                findMany: sinon.stub(),
                oneExistsWithId: sinon.stub(),
                oneExistsWithName: sinon.stub(),
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
                oneExistsWithId: sinon.stub(),
                createOne: sinon.stub(),
                deleteMany: sinon.stub()
            },
            entrypoints: {
                findOne: sinon.stub(),
                findOneByUrlMatcher: sinon.stub(),
                findManyByAppId: sinon.stub(),
                findManyByUrlMatcherHostname: sinon.stub(),
                oneExistsWithUrlMatcher: sinon.stub(),
                anyExistsWithAppId: sinon.stub(),
                anyExistsWithBundleId: sinon.stub(),
                createOne: sinon.stub(),
                updateOne: sinon.stub(),
                deleteOne: sinon.stub()
            },
            groups: {
                findOne: sinon.stub(),
                findMany: sinon.stub(),
                oneExistsWithName: sinon.stub(),
                allExistWithIds: sinon.stub(),
                createOne: sinon.stub(),
                updateOne: sinon.stub(),
                deleteOne: sinon.stub()
            },
            operationLogs: {
                findMany: sinon.stub(),
                createOne: sinon.stub()
            },
            users: {
                findOne: sinon.stub(),
                findOneWithGroups: sinon.stub(),
                findOneWithRolesByIdpAndIdpId: sinon.stub(),
                findMany: sinon.stub(),
                oneExistsWithIdpAndIdpId: sinon.stub(),
                anyExistsWithGroupId: sinon.stub(),
                createOne: sinon.stub(),
                updateOne: sinon.stub(),
                deleteOne: sinon.stub()
            },
            checkHealth: sinon.stub()
        }
    };
}
