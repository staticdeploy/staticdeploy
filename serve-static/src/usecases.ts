import * as sd from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";

const usecases: IUsecasesByName = {
    checkHealth: sd.CheckHealth,
    createApp: sd.CreateApp,
    createBundle: sd.CreateBundle,
    createEntrypoint: sd.CreateEntrypoint,
    createGroup: sd.CreateGroup,
    createUser: sd.CreateUser,
    deleteApp: sd.DeleteApp,
    deleteBundlesByNameAndTag: sd.DeleteBundlesByNameAndTag,
    deleteEntrypoint: sd.DeleteEntrypoint,
    deleteGroup: sd.DeleteGroup,
    deleteUser: sd.DeleteUser,
    deployBundle: sd.DeployBundle,
    getApp: sd.GetApp,
    getApps: sd.GetApps,
    getBundle: sd.GetBundle,
    getBundleNames: sd.GetBundleNames,
    getBundles: sd.GetBundles,
    getBundlesByNameAndTag: sd.GetBundlesByNameAndTag,
    getBundleTagsByBundleName: sd.GetBundleTagsByBundleName,
    getEntrypoint: sd.GetEntrypoint,
    getEntrypointsByAppId: sd.GetEntrypointsByAppId,
    getGroup: sd.GetGroup,
    getGroups: sd.GetGroups,
    getOperationLogs: sd.GetOperationLogs,
    getUser: sd.GetUser,
    getUsers: sd.GetUsers,
    respondToEndpointRequest: sd.RespondToEndpointRequest,
    updateApp: sd.UpdateApp,
    updateEntrypoint: sd.UpdateEntrypoint,
    updateGroup: sd.UpdateGroup,
    updateUser: sd.UpdateUser
};
export default usecases;
