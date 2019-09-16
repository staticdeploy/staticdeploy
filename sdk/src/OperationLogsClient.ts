import { IOperationLog } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

export default class OperationLogsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IOperationLog[]> {
        const result = await this.axios.get("/operationLogs");
        return result.data;
    }

    async getOne(id: string): Promise<IOperationLog> {
        const result = await this.axios.get(`/operationLogs/${id}`);
        return result.data;
    }
}
