import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        appId: faker.random.alphaNumeric(8),
        bundleId: null,
        urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}`,
        configuration: null,
        ...req.body,
        id: req.params.entrypointId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}) as RequestHandler;
