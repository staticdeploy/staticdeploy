import IStorages from "./IStorages";

export default interface IStoragesModule {
    setup(): Promise<void>;
    getStorages(): IStorages;
}
