import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        appId: faker.random.alphaNumeric(8),
        urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}`,
        bundleId: null,
        redirectTo: null,
        configuration: null,
        ...req.body,
        id: req.params.entrypointId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}) as RequestHandler;
