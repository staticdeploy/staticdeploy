import { IOperationLog, Operation } from "@staticdeploy/common-types";
import Sequelize from "sequelize";

export class OperationLogModel extends Sequelize.Model
    implements IOperationLog {
    id!: string;
    operation!: Operation;
    parameters!: {
        [key: string]: any;
    };
    performedBy!: string;
    performedAt!: Date;
}

export const OPERATION_LOGS_TABLE = "operationLogs";

export default (sequelize: Sequelize.Sequelize): typeof OperationLogModel => {
    OperationLogModel.init(
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            operation: { type: Sequelize.STRING },
            parameters: { type: Sequelize.JSON },
            performedBy: { type: Sequelize.STRING },
            performedAt: { type: Sequelize.DATE }
        },
        {
            sequelize: sequelize,
            tableName: OPERATION_LOGS_TABLE,
            timestamps: true,
            createdAt: "performedAt",
            updatedAt: false
        }
    );
    return OperationLogModel;
};
