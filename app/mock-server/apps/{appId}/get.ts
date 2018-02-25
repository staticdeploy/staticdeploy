import { RequestHandler } from "express";
import faker from "faker";
import { lowerCase } from "lodash";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.appId,
        name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
        defaultConfiguration: { KEY: "VALUE" },
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}) as RequestHandler;
