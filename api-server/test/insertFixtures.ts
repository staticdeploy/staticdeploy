import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";

interface IData {
    apps?: any[];
    deployments?: any[];
    entrypoints?: any[];
}

export default async function insertFixtures(data: IData) {
    await Deployment.destroy({ where: {} });
    await Entrypoint.destroy({ where: {} });
    await App.destroy({ where: {} });
    for (const app of data.apps || []) {
        await App.create(app);
    }
    for (const entrypoint of data.entrypoints || []) {
        await Entrypoint.create(entrypoint);
    }
    for (const deployment of data.deployments || []) {
        await Deployment.create(deployment);
    }
}
