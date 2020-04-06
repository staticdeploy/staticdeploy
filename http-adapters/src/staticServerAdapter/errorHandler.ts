import {
    NoBundleOrRedirectToError,
    NoMatchingEntrypointError,
} from "@staticdeploy/core";
import { ErrorRequestHandler } from "express";

export default function errorHandler(): ErrorRequestHandler {
    return (err, _req, res, _next) => {
        res.status(getStatusCode(err)).type("html").send(renderPage(err));
    };
}

function renderPage(error: Error) {
    return `
        <!doctype hmtl>

        <head>
            <title>${renderTitle(error)}</title>
            <style>
                body {
                    box-sizing: border-box;
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0px;
                    left: 0px;
                    padding-top: 50px;
                    background-color: #f5f5f5;
                    font-family: sans-serif;
                    text-align: center;
                }

                #error-code {
                    color: #bfbfbf;
                    font-size: 144px;
                }

                #error-message {
                    color: #262626;
                    font-size: 22px;
                    line-height: 44px;
                }

                #powered-by {
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    font-style: italic;
                    position: fixed;
                    bottom: 28px;
                }
            </style>
        </head>

        <body>
            <div id="error-code">
                ${getStatusCode(error)}
            </div>

            <div id="error-message">
                ${renderMessage(error)}
            </div>

            <div id="powered-by">
                Powered by StaticDeploy
            </div>
        </body>
    `;
}

function getStatusCode(error: Error): number {
    if (error instanceof NoBundleOrRedirectToError) {
        return 404;
    }
    if (error instanceof NoMatchingEntrypointError) {
        return 404;
    }
    return 500;
}

function renderTitle(error: Error): string {
    if (error instanceof NoBundleOrRedirectToError) {
        return "No bundle deployed";
    }
    if (error instanceof NoMatchingEntrypointError) {
        return "Entrypoint not found";
    }
    return "Internal server error";
}

function renderMessage(error: Error): string {
    if (error instanceof NoBundleOrRedirectToError) {
        return `No bundle deployed for entrypoint <br /><b>${error.matchingEntrypointUrlMatcher}</b>`;
    }
    if (error instanceof NoMatchingEntrypointError) {
        return `No entrypoint found matching url <br /><b>${error.requestedUrl}</b>`;
    }
    return "Internal server error";
}
