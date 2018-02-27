import Sequelize from "sequelize";

import getAppModel, { AppModel } from "./App";
import getDeploymentModel, { DeploymentModel } from "./Deployment";
import getEntrypointModel, { EntrypointModel } from "./Entrypoint";

export interface IModels {
    App: AppModel;
    Deployment: DeploymentModel;
    Entrypoint: EntrypointModel;
}

export default (sequelize: Sequelize.Sequelize): IModels => ({
    App: getAppModel(sequelize),
    Deployment: getDeploymentModel(sequelize),
    Entrypoint: getEntrypointModel(sequelize)
});
