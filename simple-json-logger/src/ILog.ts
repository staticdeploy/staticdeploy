export enum LogLevel {
    Info = "INFO",
    Error = "ERROR"
}

export interface IContext {
    [key: string]: string;
}

export interface IDetails {
    [key: string]: any;
    error?: any;
}

export default interface ILog {
    level: LogLevel;
    message: string;
    date: string;
    context: IContext;
    details?: IDetails;
}
