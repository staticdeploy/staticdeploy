import IAsset from "./IAsset";

export default interface IBundle {
    id: string;
    name: string;
    tag: string;
    description: string;
    hash: string;
    assets: IAsset[];
    createdAt: Date;
}
