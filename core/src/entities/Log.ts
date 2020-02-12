export enum LogLevel {
    Info = "info",
    Error = "error"
}

export interface ILog {
    level: LogLevel;
    message: string;
    date: Date;
    context: {
        requestId: string;
        userId: string;
        usecase: string;
    };
    details?: {
        [key: string]: any;
    };
}
