import { IConfiguration } from "@staticdeploy/common-types";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    bundleId: string | null;
    redirectTo: string;
    urlMatcher: string;
    configuration: IKVPair[];
}

export interface IExternalFormValues {
    bundleId: string | null;
    redirectTo: string | null;
    urlMatcher: string;
    configuration?: IConfiguration | null;
}
