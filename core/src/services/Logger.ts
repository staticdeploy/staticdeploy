import ILogger from "../dependencies/ILogger";
import IRequestContext from "../dependencies/IRequestContext";
import { ILog, LogLevel } from "../entities/Log";
import { IUser } from "../entities/User";

export default class Logger {
    private user: IUser | null = null;
    constructor(
        private logger: ILogger,
        private requestContext: IRequestContext,
        private usercase: string
    ) {}

    _setUser(user: IUser | null): void {
        this.user = user;
    }

    info(message: ILog["message"], details?: ILog["details"]): void {
        this.log(LogLevel.Info, message, details);
    }
    error(message: ILog["message"], details?: ILog["details"]): void {
        this.log(LogLevel.Error, message, details);
    }

    private log(
        level: LogLevel,
        message: ILog["message"],
        details?: ILog["details"]
    ): void {
        this.logger.log({
            level: level,
            message: message,
            date: new Date(),
            context: {
                requestId: this.requestContext.requestId,
                userId: this.user?.id ?? "anonymous",
                usecase: this.usercase
            },
            details: details
        });
    }
}
