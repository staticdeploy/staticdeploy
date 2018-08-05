export default interface IAsset {
    path: string;
    mimeType: string;
    headers: {
        [name: string]: string;
    };
}
