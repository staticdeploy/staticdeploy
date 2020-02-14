import { RequestHandler } from "express";

import { externalCache } from "../generators";

export default ((req, res) => {
    res.status(201).send(
        externalCache({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body
        })
    );
}) as RequestHandler;
