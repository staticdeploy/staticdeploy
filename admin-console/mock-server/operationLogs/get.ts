import { RequestHandler } from "express";
import faker from "faker";
import { range } from "lodash";

const operationLogs = range(100).map(() => ({
    id: faker.random.alphaNumeric(8),
    operation: faker.random.arrayElement([
        "apps:create",
        "apps:update",
        "apps:delete",
        "entrypoints:create",
        "entrypoints:update",
        "entrypoints:delete",
        "bundles:create",
        "bundles:delete"
    ]),
    parameters: {},
    performedBy: faker.internet.email(),
    performedAt: faker.date.past()
}));

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(operationLogs);
    }
}) as RequestHandler;
