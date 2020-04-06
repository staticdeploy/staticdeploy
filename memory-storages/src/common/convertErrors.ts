import { GenericStoragesError } from "@staticdeploy/core";
import { isFunction, keys } from "lodash";

// tslint:disable-next-line: ban-types
function withErrorsConverter(method: Function): Function {
    return function errorsConverter(this: any) {
        try {
            return method.apply(this, arguments);
        } catch (err) {
            throw new GenericStoragesError(err);
        }
    };
}

// Given a class, wraps all of its methods so that - when they throw an error -
// the error is converted into a GenericStoragesError
// tslint:disable-next-line:ban-types
export default function convertErrors(constructor: Function) {
    keys(constructor.prototype).forEach((key) => {
        const method = constructor.prototype[key];
        if (isFunction(method)) {
            constructor.prototype[key] = withErrorsConverter(method);
        }
    });
}
