import { RequestHandler } from "express";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.appId,
        name: req.body,
        defaultConfiguration: { KEY: "VALUE" }
    });
}) as RequestHandler;
