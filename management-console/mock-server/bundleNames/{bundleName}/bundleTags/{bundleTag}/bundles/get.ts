import { RequestHandler } from "express";

import { bundle, times } from "../../../../../generators";

export default ((req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        const { bundleName, bundleTag } = req.params;
        res.status(200).send(
            times(20, () => bundle({ name: bundleName, tag: bundleTag }))
        );
    }
}) as RequestHandler;
