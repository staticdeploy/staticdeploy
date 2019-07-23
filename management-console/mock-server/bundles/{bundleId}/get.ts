import { RequestHandler } from "express";
import faker from "faker";

export default ((req, res) => {
    res.status(200).send({
        id: req.params.bundleId,
        hash: faker.random.alphaNumeric(255),
        name: faker.lorem.word(),
        tag: faker.lorem.word(),
        description: faker.lorem.sentence(8),
        assets: [
            { path: "/index.html", mimeType: "text/html" },
            { path: "/js/index.js", mimeType: "application/js" },
            { path: "/css/index.css", mimeType: "text/css" }
        ],
        fallbackAssetPath: faker.random.arrayElement([
            "/index.html",
            "/404.html"
        ]),
        fallbackStatusCode: faker.random.arrayElement([404, 200]),
        createdAt: faker.date.past()
    });
}) as RequestHandler;
