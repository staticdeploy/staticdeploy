import IConfiguration from "./IConfiguration";

export default interface IEntrypoint {
    id: string;
    appId: string;
    urlMatcher: string;
    fallbackResource: string;
    configuration: IConfiguration | null;
    activeDeploymentId: string | null;
    createdAt: Date;
    updatedAt: Date;
};
