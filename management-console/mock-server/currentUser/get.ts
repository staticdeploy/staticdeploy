import { RequestHandler } from "express";

export default ((_req, res) => {
    if (Math.random() > 0.9) {
        res.status(403).send({
            message:
                "NoUserCorrespondingToIdpUserError: Access denied. To gain access, ask an admin to create a user with idp = idp and idpId = idpId"
        });
    } else {
        res.status(200).send({});
    }
}) as RequestHandler;
