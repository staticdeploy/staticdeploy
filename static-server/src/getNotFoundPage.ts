export enum NotFoundErrorCode {
    noEntrypointFound = "noEntrypointFound",
    noBundleDeployed = "noBundleDeployed"
}
export interface INotFoundErrorDetails {
    requestedUrl?: string;
    matchingEntrypoint?: string;
}

export class NotFoundError extends Error {
    public code: NotFoundErrorCode;
    public details: INotFoundErrorDetails;
    constructor(code: NotFoundErrorCode, details: INotFoundErrorDetails) {
        super(code);
        this.code = code;
        this.details = details;
    }
}

function getTitle(notFoundError: NotFoundError) {
    switch (notFoundError.code) {
        case NotFoundErrorCode.noEntrypointFound:
            return "Entrypoint not found";
        case NotFoundErrorCode.noBundleDeployed:
            return "No bundle deployed";
    }
}

function getMessage(notFoundError: NotFoundError) {
    switch (notFoundError.code) {
        case NotFoundErrorCode.noEntrypointFound:
            return `No entrypoint found matching url <br /><b>${
                notFoundError.details.requestedUrl
            }</b>`;
        case NotFoundErrorCode.noBundleDeployed:
            return `No bundle deployed for entrypoint <br /><b>${
                notFoundError.details.matchingEntrypoint
            }</b>`;
    }
}

export default function getNotFoundPage(notFoundError: NotFoundError) {
    return `
        <!doctype hmtl>

        <head>
            <title>${getTitle(notFoundError)}</title>
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

                #not-found-code {
                    color: #bfbfbf;
                    font-size: 144px;
                }

                #not-found-message {
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
            <div id="not-found-code">
                404
            </div>

            <div id="not-found-message">
                ${getMessage(notFoundError)}
            </div>

            <div id="powered-by">
                Powered by StaticDeploy
            </div>
        </body>
    `;
}
