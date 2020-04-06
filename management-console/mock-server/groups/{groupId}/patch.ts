import { RequestHandler } from "express";

import { group } from "../../generators";

export default ((req, res) => {
    res.status(200).send(
        group({
            id: req.params.groupId,
            updatedAt: new Date().toISOString(),
            ...req.body,
        })
    );
}) as RequestHandler;
