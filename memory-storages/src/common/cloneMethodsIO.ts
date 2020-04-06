import { clone, isFunction, keys } from "lodash";

// tslint:disable-next-line: ban-types
function wrap(method: Function): Function {
    return function cloneMethodIO(this: any) {
        return clone(method.apply(this, clone(arguments)));
    };
}

// Given a class, wraps all of its methods so that:
// - their arguments are cloned before being passed to the function
// - their return values are cloned before being returned to the caller
// Doing this, we safeguard against the values used by the methods being
// modified from outside the class
// tslint:disable-next-line:ban-types
export default function cloneMethodsIO(constructor: Function) {
    keys(constructor.prototype).forEach((key) => {
        const method = constructor.prototype[key];
        if (isFunction(method)) {
            constructor.prototype[key] = wrap(method);
        }
    });
}
