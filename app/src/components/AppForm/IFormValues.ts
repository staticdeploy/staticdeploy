import { IConfiguration } from "@staticdeploy/sdk";

import { IKVPair } from "../../common/configurationUtils";

export interface IInternalFormValues {
    name: string;
    defaultConfiguration: IKVPair[];
}

export interface IExternalFormValues {
    name: string;
    defaultConfiguration: IConfiguration;
}
