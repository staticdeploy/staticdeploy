import { errors } from "@staticdeploy/core";
import { isFunction, keys } from "lodash";

// tslint:disable-next-line: ban-types
function wrap(method: Function): Function {
    return function convertMethodErrors(this: any) {
        try {
            return method.apply(this, arguments);
        } catch (err) {
            throw new errors.GenericStorageError(err);
        }
    };
}

// Given a class, wraps all of its methods so that - when they throw an error -
// the error is converted into a GenericStorageError
// tslint:disable-next-line:ban-types
export default function convertErrors(constructor: Function) {
    keys(constructor.prototype).forEach(key => {
        const method = constructor.prototype[key];
        if (isFunction(method)) {
            constructor.prototype[key] = wrap(method);
        }
    });
}
