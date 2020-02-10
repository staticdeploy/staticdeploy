import { RequestHandler } from "express";

export default ((_req, res) => {
    res.status(204).send();
}) as RequestHandler;
