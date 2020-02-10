import { RequestHandler } from "express";

import { externalCache, times } from "../generators";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(times(10, externalCache));
    }
}) as RequestHandler;
