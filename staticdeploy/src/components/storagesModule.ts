import { IStoragesModule } from "@staticdeploy/core";
import MemoryStorages from "@staticdeploy/memory-storages";
import PgS3Storages from "@staticdeploy/pg-s3-storages";
import Logger from "bunyan";
import { isNil } from "lodash";

import IConfig from "../common/IConfig";

export default (config: IConfig, logger: Logger): IStoragesModule => {
    const useMemoryStorages =
        isNil(config.postgresUrl) ||
        isNil(config.s3Bucket) ||
        isNil(config.s3Endpoint) ||
        isNil(config.s3AccessKeyId) ||
        isNil(config.s3SecretAccessKey);

    logger.info(
        `Using ${
            useMemoryStorages ? MemoryStorages.name : PgS3Storages.name
        } storages module`
    );

    return useMemoryStorages
        ? new MemoryStorages()
        : new PgS3Storages({
              postgresUrl: config.postgresUrl!,
              s3Config: {
                  bucket: config.s3Bucket!,
                  endpoint: config.s3Endpoint!,
                  accessKeyId: config.s3AccessKeyId!,
                  secretAccessKey: config.s3SecretAccessKey!,
              },
          });
};
