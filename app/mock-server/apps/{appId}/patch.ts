import { RequestHandler } from "express";
import faker from "faker";
import { lowerCase } from "lodash";

export default ((req, res) => {
    res.status(200).send({
        name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
        defaultConfiguration: { KEY: "VALUE" },
        ...req.body,
        id: req.params.appId,
        createdAt: faker.date.past(),
        updatedAt: new Date().toISOString()
    });
}) as RequestHandler;
