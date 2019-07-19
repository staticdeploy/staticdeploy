import { IStoragesModule } from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";
import tarArchiver from "@staticdeploy/tar-archiver";

export default function getMakeUsecase(options: {
    storagesModule: IStoragesModule;
    usecases: IUsecasesByName;
}) {
    return <Name extends keyof IUsecasesByName>(name: Name) => {
        const UsecaseClass = options.usecases[name];
        return new UsecaseClass({
            storages: options.storagesModule.getStorages(),
            requestContext: { userId: "default" },
            archiver: tarArchiver
        }) as InstanceType<IUsecasesByName[Name]>;
    };
}
