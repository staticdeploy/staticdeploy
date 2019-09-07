import express from "express";

import errorHandler from "./errorHandler";
import staticRoute from "./staticRoute";

export default function staticServerAdapter(options: {
    hostnameHeader?: string;
}): express.Application {
    return (
        express()
            .disable("x-powered-by")
            // When present, use X-Forwarded-* headers to determine request properties
            // like the originally requested hostname
            .set("trust proxy", true)
            .use(staticRoute(options))
            .use(errorHandler())
    );
}
