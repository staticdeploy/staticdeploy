export default interface IDeployment {
    id: string;
    entrypointId: string;
    description: string | null;
    createdAt: Date;
};
