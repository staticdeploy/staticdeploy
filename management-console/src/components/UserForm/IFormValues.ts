import { UserType } from "@staticdeploy/core";

export default interface IFormValues {
    idp: string;
    idpId: string;
    type: UserType;
    name: string;
    groupsIds: string[];
}
