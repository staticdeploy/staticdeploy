import { RequestHandler } from "express";

import { userWithGroups } from "../../generators";

export default ((req, res) => {
    res.status(200).send(userWithGroups({ id: req.params.userId }));
}) as RequestHandler;
