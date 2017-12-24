import handleStorageErrors from "common/handleStorageErrors";
import { IConvRoute } from "convexpress";

export default (convroute: IConvRoute): IConvRoute => ({
    ...convroute,
    handler: handleStorageErrors(convroute.handler)
});
