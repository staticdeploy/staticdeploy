import * as sd from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";

const usecases: IUsecasesByName = {
    checkHealth: sd.CheckHealth,
    createApp: sd.CreateApp,
    createBundle: sd.CreateBundle,
    createEntrypoint: sd.CreateEntrypoint,
    deleteApp: sd.DeleteApp,
    deleteBundlesByNameAndTag: sd.DeleteBundlesByNameAndTag,
    deleteEntrypoint: sd.DeleteEntrypoint,
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
    getOperationLogs: sd.GetOperationLogs,
    respondToEndpointRequest: sd.RespondToEndpointRequest,
    updateApp: sd.UpdateApp,
    updateEntrypoint: sd.UpdateEntrypoint
};
export default usecases;
