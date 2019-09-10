import { RequestHandler } from "express";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send({
            authorization_endpoint: "http://localhost:3456/oidc/authorize"
        });
    }
}) as RequestHandler;
