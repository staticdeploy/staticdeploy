import { RequestHandler } from "express";

import { bundle } from "../../generators";

export default ((req, res) => {
    res.status(200).send(bundle({ id: req.params.bundleId }));
}) as RequestHandler;
