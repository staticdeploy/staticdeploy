import { RequestHandler } from "express";
import * as faker from "faker";
import { lowerCase } from "lodash";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.appId,
        name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
        defaultConfiguration: req.body
    });
}) as RequestHandler;
