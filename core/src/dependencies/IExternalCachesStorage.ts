import { IExternalCache } from "../entities/ExternalCache";

export default interface IExternalCachesStorage {
    findOne(id: string): Promise<IExternalCache | null>;
    findOneByDomain(domain: string): Promise<IExternalCache | null>;
    findMany(): Promise<IExternalCache[]>;
    oneExistsWithDomain(domain: string): Promise<boolean>;
    createOne(externalCache: {
        id: string;
        type: string;
        domain: string;
        configuration: IExternalCache["configuration"];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IExternalCache>;
    updateOne(
        id: string,
        patch: {
            type?: string;
            domain?: string;
            configuration?: IExternalCache["configuration"];
            updatedAt: Date;
        }
    ): Promise<IExternalCache>;
    deleteOne(id: string): Promise<void>;
}
