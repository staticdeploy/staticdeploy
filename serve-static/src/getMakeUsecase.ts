import {
    IArchiver,
    IAuthenticationStrategy,
    IExternalCacheService,
    IRequestContext,
    IStorages,
    IUsecaseConfig
} from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";

export default function getMakeUsecase(
    usecases: IUsecasesByName,
    dependencies: {
        archiver: IArchiver;
        authenticationStrategies: IAuthenticationStrategy[];
        externalCacheServices: IExternalCacheService[];
        config: IUsecaseConfig;
        storages: IStorages;
        requestContext: IRequestContext;
    }
) {
    return <Name extends keyof IUsecasesByName>(name: Name) => {
        const UsecaseClass = usecases[name];
        return new UsecaseClass(dependencies) as InstanceType<
            IUsecasesByName[Name]
        >;
    };
}
