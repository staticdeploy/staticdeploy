export enum AuthEnforcementLevel {
    None,
    Authentication,
    Authorization
}

export default interface IUsecaseConfig {
    authEnforcementLevel: AuthEnforcementLevel;
}
