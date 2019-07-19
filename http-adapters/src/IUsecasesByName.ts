import * as sd from "@staticdeploy/core";

export default interface IUsecasesByName {
    checkHealth: typeof sd.CheckHealth;
    createApp: typeof sd.CreateApp;
    createBundle: typeof sd.CreateBundle;
    createEntrypoint: typeof sd.CreateEntrypoint;
    deleteApp: typeof sd.DeleteApp;
    deleteBundlesByNameAndTag: typeof sd.DeleteBundlesByNameAndTag;
    deleteEntrypoint: typeof sd.DeleteEntrypoint;
    deployBundle: typeof sd.DeployBundle;
    getApp: typeof sd.GetApp;
    getApps: typeof sd.GetApps;
    getBundle: typeof sd.GetBundle;
    getBundleNames: typeof sd.GetBundleNames;
    getBundles: typeof sd.GetBundles;
    getBundlesByNameAndTag: typeof sd.GetBundlesByNameAndTag;
    getBundleTagsByBundleName: typeof sd.GetBundleTagsByBundleName;
    getEntrypoint: typeof sd.GetEntrypoint;
    getEntrypointsByAppId: typeof sd.GetEntrypointsByAppId;
    getOperationLogs: typeof sd.GetOperationLogs;
    respondToEndpointRequest: typeof sd.RespondToEndpointRequest;
    updateApp: typeof sd.UpdateApp;
    updateEntrypoint: typeof sd.UpdateEntrypoint;
}
