import { RequestHandler } from "express";

import { user } from "../generators";

export default ((req, res) => {
    res.status(201).send(
        user({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
