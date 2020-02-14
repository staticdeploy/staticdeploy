import { RequestHandler } from "express";

import { externalCache } from "../../generators";

export default ((req, res) => {
    res.status(200).send(externalCache({ id: req.params.externalCacheId }));
}) as RequestHandler;
