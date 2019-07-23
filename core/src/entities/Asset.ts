export interface IAsset {
    path: string;
    mimeType: string;
    content?: Buffer;
    headers: {
        [name: string]: string;
    };
}
export interface IAssetWithoutContent extends IAsset {
    content: undefined;
}

export interface IAssetWithContent extends IAsset {
    content: Buffer;
}
