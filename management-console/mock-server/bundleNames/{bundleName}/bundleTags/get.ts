import { RequestHandler } from "express";
import { uniq } from "lodash";

import { bundleTag, times } from "../../../generators";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(uniq(times(30, bundleTag)));
    }
}) as RequestHandler;
