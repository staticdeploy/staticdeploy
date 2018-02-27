import { RequestHandler } from "express";
import * as faker from "faker";

export default ((req, res) => {
    res.status(201).send({
        id: faker.random.alphaNumeric(8),
        ...req.body
    });
}) as RequestHandler;
