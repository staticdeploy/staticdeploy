import { RequestHandler } from "express";

import { app } from "../../generators";

export default ((req, res) => {
    res.status(200).send(
        app({
            id: req.params.appId,
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
