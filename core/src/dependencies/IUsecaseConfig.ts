export enum AuthEnforcementLevel {
    None,
    Authorization
}

export default interface IUsecaseConfig {
    authEnforcementLevel: AuthEnforcementLevel;
}
