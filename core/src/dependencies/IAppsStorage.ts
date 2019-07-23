import { IApp } from "../entities/App";
import { IConfiguration } from "../entities/Configuration";

export default interface IAppsStorage {
    findOne(id: string): Promise<IApp | null>;
    findOneByName(name: string): Promise<IApp | null>;
    findMany(): Promise<IApp[]>;
    createOne(app: {
        id: string;
        name: string;
        defaultConfiguration: IConfiguration;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IApp>;
    updateOne(
        id: string,
        patch: {
            name?: string;
            defaultConfiguration?: IConfiguration;
            updatedAt: Date;
        }
    ): Promise<IApp>;
    deleteOne(id: string): Promise<void>;
}
