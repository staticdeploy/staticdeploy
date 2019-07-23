declare module "vhost" {
    import { RequestHandler } from "express";
    export default function vhost(
        hostname: string | RegExp,
        handle: RequestHandler
    ): RequestHandler;
}
