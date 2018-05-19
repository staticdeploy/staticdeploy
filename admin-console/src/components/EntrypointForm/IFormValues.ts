import { IConfiguration } from "@staticdeploy/common-types";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    redirectTo: string;
    urlMatcher: string;
    configuration: IKVPair[];
}

export interface IExternalFormValues {
    redirectTo: string | null;
    urlMatcher: string;
    configuration?: IConfiguration | null;
}
