import express from "express";

import errorHandler from "./errorHandler";
import staticRoute from "./staticRoute";

export default function staticServerAdapter(options: {
    hostnameHeader?: string;
}): express.Express {
    const app = express();

    // When present, use X-Forwarded-* headers to determine request properties
    // like the originally requested hostname
    app.set("trust proxy", true);

    app.use(staticRoute(options));
    app.use(errorHandler());

    return app;
}
