import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(201).send({
        defaultConfiguration: {},
        ...req.body,
        id: faker.random.alphaNumeric(8),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
}) as RequestHandler;
