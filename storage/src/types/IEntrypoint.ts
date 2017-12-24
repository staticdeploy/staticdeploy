import IConfiguration from "./IConfiguration";

export default interface IEntrypoint {
    id: string;
    appId: string;
    urlMatcher: string;
    urlMatcherPriority: number;
    smartRoutingEnabled: boolean;
    activeDeploymentId: string | null;
    configuration: IConfiguration | null;
    createdAt: Date;
    updatedAt: Date;
};
