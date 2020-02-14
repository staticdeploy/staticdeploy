interface IDetails {
    execTimeMs?: number;
    error?: any;
    [key: string]: any;
}
export default interface ILogger {
    addToContext(key: string, value: string): void;
    info(message: string, details?: IDetails): void;
    error(message: string, details?: IDetails): void;
}
