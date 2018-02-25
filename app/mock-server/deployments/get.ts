import { RequestHandler } from "express";
import faker from "faker";
import { range } from "lodash";

const deployments = range(10).map(() => ({
    id: faker.random.alphaNumeric(8),
    entrypointId: faker.random.alphaNumeric(8),
    description: faker.lorem.sentence(),
    createdAt: faker.date.past()
}));

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(deployments);
    }
}) as RequestHandler;
