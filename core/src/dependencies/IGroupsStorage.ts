import { IGroup } from "../entities/Group";

export default interface IGroupsStorage {
    findOne(id: string): Promise<IGroup | null>;
    findMany(): Promise<IGroup[]>;
    oneExistsWithName(name: string): Promise<boolean>;
    allExistWithIds(ids: string[]): Promise<boolean>;
    createOne(role: {
        id: string;
        name: string;
        roles: string[];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IGroup>;
    updateOne(
        id: string,
        patch: {
            name?: string;
            roles?: string[];
            updatedAt: Date;
        }
    ): Promise<IGroup>;
    deleteOne(id: string): Promise<void>;
}
