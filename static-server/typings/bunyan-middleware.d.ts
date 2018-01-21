/*
*   For some reason which I (pscanf) was unable to identify, the typing provided
*   by bunyan-middleware cant't modify express's Request and Response types
*   adding the log property, although it does define the modification.
*   Placing the modification here though works, hence the following.
*/
/* tslint:disable:interface-name */
import Logger = require("bunyan");

declare module "express" {
    export interface Request {
        log: Logger;
    }
    export interface Response {
        log: Logger;
    }
}
