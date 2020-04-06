import { RequestHandler } from "express";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(409).send({
            message:
                "Can't delete bundles with ids = [ aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa, aaaaaaaa ], as one or more of them are being used by some entrypoints",
        });
    } else {
        res.status(204).send();
    }
}) as RequestHandler;
