import { RequestHandler } from "express";
import faker from "faker";
import { range } from "lodash";

const bundleTags = range(30).map(n => `${faker.lorem.word()}-${n}`);

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(400).send({ message: "Random error" });
    } else {
        res.status(200).send(bundleTags);
    }
}) as RequestHandler;
