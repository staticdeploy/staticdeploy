import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";

export default class GetApps extends Usecase {
    async exec(): Promise<IApp[]> {
        // Auth check
        this.authorizer.ensureCanGetApps();

        return this.storages.apps.findMany();
    }
}
