import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.entrypointId,
        appId: faker.random.alphaNumeric(8),
        bundleId: Math.random() > 0.5 ? faker.random.alphaNumeric(8) : null,
        urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}/`,
        configuration:
            Math.random() > 0.5
                ? { NON_DEFAULT_KEY: "NON_DEFAULT_VALUE" }
                : null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}) as RequestHandler;
