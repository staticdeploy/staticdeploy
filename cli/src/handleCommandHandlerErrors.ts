// tslint:disable:ban-types
import log from "./log";

export default function handleCommandHandlerErrors<T extends Function>(
    commandHandler: T
): T {
    // Don't wrap the command handler when testing, to make it easier to test
    // error cases
    if (process.env.NODE_ENV === "test") {
        return commandHandler;
    }
    return async function commandHandlerWrapper(this: any) {
        try {
            return await commandHandler.apply(this, arguments);
        } catch (err) {
            log.error(err.message);
            process.exit(1);
        }
    } as any;
}
