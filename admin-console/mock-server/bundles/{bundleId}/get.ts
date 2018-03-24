import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.bundleId,
        hash: faker.random.alphaNumeric(255),
        name: faker.lorem.word(),
        tag: faker.lorem.word(),
        description: faker.lorem.sentence(8),
        assets: [],
        createdAt: faker.date.past()
    });
}) as RequestHandler;
