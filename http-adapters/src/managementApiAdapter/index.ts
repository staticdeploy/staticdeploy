import convexpress from "convexpress";
import express from "express";
import { extname } from "path";

const IS_CURRENT_FILE_TYPESCRIPT = extname(__filename) === ".ts";

export default function managementApiAdapter(options: {
    serviceName: string;
    serviceVersion: string;
    serviceHost: string;
}): express.Application {
    const convexpressOptions = {
        info: {
            title: options.serviceName,
            version: options.serviceVersion
        },
        host: options.serviceHost,
        bodyParserOptions: {
            limit: "100mb",
            strict: false
        }
    };
    const router = convexpress(convexpressOptions)
        .serveSwagger()
        .loadFrom(
            `${__dirname}/routes/*.${IS_CURRENT_FILE_TYPESCRIPT ? "ts" : "js"}`
        );

    return express()
        .disable("x-powered-by")
        .use(router);
}
