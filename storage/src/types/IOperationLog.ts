export default interface IOperationLog {
    id: string;
    operation: string;
    // Un-typed JSON object
    parameters: { [key: string]: any };
    performedBy: string;
    performedAt: Date;
}
