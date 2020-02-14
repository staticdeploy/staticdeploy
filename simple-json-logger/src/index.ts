import { ILogger } from "@staticdeploy/core";

import extractErrorDetails from "./extractErrorDetails";
import fastSafeJsonStringify from "./fastSafeJsonStringify";
import ILog, { IContext, IDetails, LogLevel } from "./ILog";

export default class SimpleJsonLogger implements ILogger {
    private context: IContext = {};
    constructor(private outStream: NodeJS.WritableStream | null) {}

    addToContext(key: string, value: string): void {
        this.context[key] = value;
    }

    info(message: string, details?: IDetails): void {
        this.log(LogLevel.Info, message, details);
    }
    error(message: string, details?: IDetails): void {
        this.log(LogLevel.Error, message, details);
    }

    private log(level: LogLevel, message: string, details?: IDetails): void {
        if (this.outStream) {
            const log: ILog = {
                level: level,
                message: message,
                date: new Date().toISOString(),
                context: this.context,
                details: details?.error
                    ? {
                          ...details,
                          error: extractErrorDetails(details.error)
                      }
                    : details
            };
            this.outStream.write(fastSafeJsonStringify(log) + "\n");
        }
    }
}
