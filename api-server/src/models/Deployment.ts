import {
    Column,
    CreatedAt,
    DataType,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";

@Table({ timestamps: true, updatedAt: false })
export default class Deployment extends Model<Deployment> {
    @PrimaryKey
    @Column
    id: string;

    @Column entrypointId: string;

    @Column({ type: DataType.TEXT })
    description: string | null;

    @CreatedAt createdAt: Date;
}
