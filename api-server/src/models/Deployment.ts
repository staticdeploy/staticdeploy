import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";

import Entrypoint from "models/Entrypoint";

@Table
export default class Deployment extends Model<Deployment> {
    @Column({
        primaryKey: true
    })
    id: string;

    @ForeignKey(() => Entrypoint)
    @Column
    entrypointId: string;

    @BelongsTo(() => Entrypoint)
    entrypoint: Entrypoint;

    @Column({
        type: DataType.TEXT,
        primaryKey: true
    })
    description: string;

    @CreatedAt createdAt: Date;
}
