import { Request, RequestHandler } from "express";
import qs from "querystring";

interface IRequest extends Request {
    query: {
        redirect_uri: string;
        state?: string;
        nonce?: string;
    };
}

export default ((req: IRequest, res) => {
    const { redirect_uri, state, nonce } = req.query;
    const redirectUrl = [
        redirect_uri,
        "#?",
        qs.stringify({ id_token: "id_token", state: state, nonce: nonce })
    ].join("");
    res.status(302)
        .location(redirectUrl)
        .send();
}) as RequestHandler;
