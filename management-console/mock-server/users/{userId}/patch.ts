import { RequestHandler } from "express";

import { user } from "../../generators";

export default ((req, res) => {
    res.status(200).send(
        user({
            id: req.params.userId,
            updatedAt: new Date().toISOString(),
            ...req.body
        })
    );
}) as RequestHandler;
