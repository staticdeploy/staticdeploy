import { IConfiguration } from "@staticdeploy/sdk";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    urlMatcher: string;
    configuration: IKVPair[];
}

export interface IExternalFormValues {
    urlMatcher: string;
    configuration?: IConfiguration | null;
}
