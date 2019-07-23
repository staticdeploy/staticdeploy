import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";

export default class GetApps extends Usecase {
    async exec(): Promise<IApp[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.storages.apps.findMany();
    }
}
