import convexpress from "convexpress";
import express from "express";
import { extname } from "path";

export default function managementApiAdapter(options: {
    serviceName: string;
    serviceVersion: string;
    serviceHost: string;
    serviceBasePath: string;
    maxRequestBodySize: string;
}): express.Application {
    const convexpressOptions = {
        info: {
            title: options.serviceName,
            version: options.serviceVersion,
        },
        host: options.serviceHost,
        bodyParserOptions: {
            limit: options.maxRequestBodySize,
            strict: false,
        },
        basePath: options.serviceBasePath,
    };
    const isCurrentFileTs = extname(__filename) === ".ts";
    const router = convexpress(convexpressOptions)
        .serveSwagger()
        .loadFrom(`${__dirname}/routes/*.${isCurrentFileTs ? "ts" : "js"}`);

    return express().disable("x-powered-by").use(router);
}
