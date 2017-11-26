import { Request, Response } from "express";
import { Transaction } from "sequelize";

import sequelize from "services/sequelize";

type HandlerWithTransaction = (
    req: Request,
    res: Response,
    transaction: Transaction
) => any;

// Starts a transactions and rolls it back on errors.
// Committing the transaction must be done inside the handler.
export default function withTransaction(handler: HandlerWithTransaction) {
    return async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try {
            await handler(req, res, transaction);
        } catch (err) {
            await transaction.rollback();
        }
    };
}
