import IConfiguration from "./IConfiguration";

export default interface IEntrypoint {
    id: string;
    appId: string;
    bundleId: string | null;
    redirectTo: string | null;
    urlMatcher: string;
    configuration: IConfiguration | null;
    createdAt: Date;
    updatedAt: Date;
}
