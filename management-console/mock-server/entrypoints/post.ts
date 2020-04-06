import { RequestHandler } from "express";

import { entrypoint } from "../generators";

export default ((req, res) => {
    res.status(201).send(
        entrypoint({
            configuration: null,
            bundleId: null,
            redirectTo: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
