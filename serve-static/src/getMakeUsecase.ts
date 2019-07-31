import {
    IArchiver,
    IRequestContext,
    IStorages,
    IUsecaseConfig
} from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";

export default function getMakeUsecase(
    usecases: IUsecasesByName,
    dependencies: {
        archiver: IArchiver;
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
