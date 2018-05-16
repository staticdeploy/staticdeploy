import Sequelize from "sequelize";

import getAppModel, { AppModel } from "./App";
import getBundleModel, { BundleModel } from "./Bundle";
import getEntrypointModel, { EntrypointModel } from "./Entrypoint";
import getOperationLogModel, { OperationLogModel } from "./OperationLog";

export interface IModels {
    App: AppModel;
    Bundle: BundleModel;
    Entrypoint: EntrypointModel;
    OperationLog: OperationLogModel;
}

export default (sequelize: Sequelize.Sequelize): IModels => ({
    App: getAppModel(sequelize),
    Bundle: getBundleModel(sequelize),
    Entrypoint: getEntrypointModel(sequelize),
    OperationLog: getOperationLogModel(sequelize)
});
