import { RequestHandler } from "express";
import faker from "faker";
import { range } from "lodash";

const entrypoints = range(10).map(() => ({
    id: faker.random.alphaNumeric(8),
    appId: faker.random.alphaNumeric(8),
    bundleId: Math.random() > 0.5 ? faker.random.alphaNumeric(8) : null,
    urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}/`,
    configuration: Math.random() > 0.5 ? { KEY: "VALUE" } : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past()
}));

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(entrypoints);
    }
}) as RequestHandler;
