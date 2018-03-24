import { RequestHandler } from "express";
import faker from "faker";
import { range } from "lodash";

const bundles = range(10).map(() => ({
    id: faker.random.alphaNumeric(8),
    name: faker.lorem.word(),
    tag: faker.lorem.word(),
    description: faker.lorem.sentence(8),
    assets: [],
    createdAt: faker.date.past()
}));

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(bundles);
    }
}) as RequestHandler;
