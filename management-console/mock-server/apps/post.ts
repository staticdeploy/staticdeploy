import { RequestHandler } from "express";

import { app } from "../generators";

export default ((req, res) => {
    res.status(201).send(
        app({
            defaultConfiguration: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
