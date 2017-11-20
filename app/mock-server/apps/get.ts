import { RequestHandler } from "express";
import * as faker from "faker";
import { lowerCase, range } from "lodash";

const apps = range(10).map(() => ({
    id: faker.random.alphaNumeric(8),
    name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
    defaultConfiguration: { KEY: "VALUE" }
}));

export default ((_req, res) => {
    res.status(200).send(apps);
}) as RequestHandler;
