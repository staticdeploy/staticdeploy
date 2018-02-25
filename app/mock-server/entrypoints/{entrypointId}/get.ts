import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.entrypointId,
        appId: faker.random.alphaNumeric(8),
        urlMatcher: `${faker.internet.domainName()}/${faker.hacker.noun()}/`,
        fallbackResource: "index.html",
        configuration:
            Math.random() > 0.5
                ? { NON_DEFAULT_KEY: "NON_DEFAULT_VALUE" }
                : null,
        activeDeploymentId:
            Math.random() > 0.5 ? faker.random.alphaNumeric(8) : null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    });
}) as RequestHandler;
