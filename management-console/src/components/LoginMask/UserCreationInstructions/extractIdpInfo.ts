interface IIdpInfo {
    idp: string;
    idpId: string;
}
export default function extractIdpInfo(message: string): IIdpInfo {
    // Example message:
    // NoUserCorrespondingToIdpUserError: Access denied. To gain access, ask an admin to create a user with idp = idp and idpId = idpId
    const ipdBeforeMatcher = "idp = ";
    const ipdAfterMatcher = " and idpId";
    const idpIdBeforeMatcher = "idpId = ";
    return {
        idp: message.slice(
            message.indexOf(ipdBeforeMatcher) + ipdBeforeMatcher.length,
            message.indexOf(ipdAfterMatcher)
        ),
        idpId: message.slice(
            message.indexOf(idpIdBeforeMatcher) + idpIdBeforeMatcher.length
        )
    };
}
