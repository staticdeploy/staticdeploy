export default function parseDates(obj: any) {
    if (obj && obj.createdAt) {
        obj.createdAt = new Date(obj.createdAt);
    }
    if (obj && obj.updatedAt) {
        obj.updatedAt = new Date(obj.updatedAt);
    }
    if (obj && obj.deletedAt) {
        obj.deletedAt = new Date(obj.deletedAt);
    }
    if (obj && obj.performedAt) {
        obj.performedAt = new Date(obj.performedAt);
    }
    return obj;
}
