import Usecase from "../common/Usecase";

export default class GetBundleNames extends Usecase {
    async exec(): Promise<string[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.bundlesStorage.findManyBundleNames();
    }
}
