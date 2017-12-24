import IConfiguration from "./IConfiguration";

export default interface IApp {
    id: string;
    name: string;
    defaultConfiguration: IConfiguration;
    createdAt: Date;
    updatedAt: Date;
};
