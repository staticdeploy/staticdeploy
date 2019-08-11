import { IAuthenticationStrategy } from "@staticdeploy/core/lib";

export default async function setupAuthenticationStrategies(
    authenticationStrategies: IAuthenticationStrategy[]
): Promise<void> {
    await Promise.all(
        authenticationStrategies.map(authenticationStrategy =>
            authenticationStrategy.setup()
        )
    );
}
