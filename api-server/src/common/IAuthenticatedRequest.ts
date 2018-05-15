import { Request } from "express";

export default interface IAuthenticatedRequest extends Request {
    user: {
        sub: string;
    };
};
