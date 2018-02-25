import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(201).send({
        configuration: null,
        fallbackResource: "index.html",
        ...req.body,
        id: faker.random.alphaNumeric(8),
        activeDeploymentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
}) as RequestHandler;
