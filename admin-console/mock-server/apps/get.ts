import { RequestHandler } from "express";
import faker from "faker";
import { lowerCase, range } from "lodash";

const apps = range(10).map(() => ({
    id: faker.random.alphaNumeric(8),
    name: lowerCase(faker.commerce.productName()).replace(/ /g, "-"),
    defaultConfiguration: { KEY: "VALUE" },
    createdAt: faker.date.past(),
    updatedAt: faker.date.past()
}));

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(apps);
    }
}) as RequestHandler;
