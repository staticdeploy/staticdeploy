import { RequestHandler } from "express";

import { entrypoint } from "../../generators";

export default ((req, res) => {
    res.status(200).send(
        entrypoint({
            id: req.params.entrypointId,
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
