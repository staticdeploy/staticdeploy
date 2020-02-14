import { RequestHandler } from "express";

import { externalCacheTypes } from "../generators";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(externalCacheTypes());
    }
}) as RequestHandler;
