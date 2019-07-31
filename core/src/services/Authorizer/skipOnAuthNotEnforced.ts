export default function skipOnAuthNotEnforced(
    _target: any,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any) => void>
) {
    const originalMethod = descriptor.value!;
    return {
        ...descriptor,
        value: function authSkipper(this: any) {
            if (!this.enforceAuth) {
                return;
            }
            return originalMethod.apply(this, arguments);
        }
    };
}
