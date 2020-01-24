import { createHash } from "crypto";

import { IConfiguration } from "../../entities/Configuration";

export interface IConfigurationScript {
    content: string;
    sha256: string;
}

export default function getConfigurationScript(
    configuration: IConfiguration
): IConfigurationScript {
    const content = `window.APP_CONFIG=${JSON.stringify(configuration)};`;
    return {
        content: content,
        sha256: createHash("sha256")
            .update(content)
            .digest("hex")
    };
}
