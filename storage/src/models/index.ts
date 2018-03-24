import Sequelize from "sequelize";

import getAppModel, { AppModel } from "./App";
import getBundleModel, { BundleModel } from "./Bundle";
import getEntrypointModel, { EntrypointModel } from "./Entrypoint";

export interface IModels {
    App: AppModel;
    Bundle: BundleModel;
    Entrypoint: EntrypointModel;
}

export default (sequelize: Sequelize.Sequelize): IModels => ({
    App: getAppModel(sequelize),
    Bundle: getBundleModel(sequelize),
    Entrypoint: getEntrypointModel(sequelize)
});
