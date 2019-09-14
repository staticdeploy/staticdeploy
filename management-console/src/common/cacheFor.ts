// tslint:disable-next-line: ban-types
export default function cacheFor<F extends Function>(fn: F, ttl: number): F {
    let lastInvokedAt: number | null;
    let lastReturnValue: any;
    return function(this: any) {
        const now = Date.now();
        if (!lastInvokedAt || now > lastInvokedAt + ttl) {
            lastInvokedAt = now;
            lastReturnValue = fn.apply(this, arguments);
            return lastReturnValue;
        }
        return lastReturnValue;
    } as any;
}
