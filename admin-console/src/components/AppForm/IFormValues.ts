import { IConfiguration } from "@staticdeploy/common-types";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    name: string;
    defaultConfiguration: IKVPair[];
}

export interface IExternalFormValues {
    name: string;
    defaultConfiguration: IConfiguration;
}
