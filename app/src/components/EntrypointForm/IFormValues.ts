import { IConfiguration } from "@staticdeploy/sdk";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    urlMatcher: string;
    fallbackResource?: string;
    configuration: IKVPair[];
}

export interface IExternalFormValues {
    urlMatcher: string;
    fallbackResource?: string;
    configuration?: IConfiguration | null;
}
