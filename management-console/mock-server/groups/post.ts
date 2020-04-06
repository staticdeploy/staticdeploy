import { RequestHandler } from "express";

import { group } from "../generators";

export default ((req, res) => {
    res.status(201).send(
        group({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
