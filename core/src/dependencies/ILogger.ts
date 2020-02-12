import { ILog } from "../entities/Log";

export default interface ILogger {
    log(log: ILog): void;
}
