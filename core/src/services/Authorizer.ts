import { AuthenticationRequiredError } from "../common/errors";
import IRequestContext from "../dependencies/IRequestContext";

export default class Authorizer {
    constructor(private requestContext: IRequestContext) {}

    isAuthenticated(): boolean {
        return !!this.requestContext.userId;
    }

    ensureAuthenticated(): void {
        if (!this.isAuthenticated()) {
            throw new AuthenticationRequiredError();
        }
    }
}
