import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";

type Arguments = [];
type ReturnValue = IApp[];

export default class GetApps extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetApps();

        return this.storages.apps.findMany();
    }
}
