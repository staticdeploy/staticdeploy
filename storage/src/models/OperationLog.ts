import Sequelize from "sequelize";

import IOperationLog from "../types/IOperationLog";

export type OperationLogModel = Sequelize.Model<
    Sequelize.Instance<Partial<IOperationLog>>,
    Partial<IOperationLog>
>;

export const OPERATION_LOGS_TABLE = "operationLogs";

export default (sequelize: Sequelize.Sequelize): OperationLogModel =>
    sequelize.define(
        "operationLog",
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            operation: { type: Sequelize.STRING },
            parameters: { type: Sequelize.JSON },
            performedBy: { type: Sequelize.STRING },
            performedAt: { type: Sequelize.DATE }
        },
        {
            tableName: OPERATION_LOGS_TABLE,
            timestamps: true,
            createdAt: "performedAt",
            updatedAt: false
        }
    );
