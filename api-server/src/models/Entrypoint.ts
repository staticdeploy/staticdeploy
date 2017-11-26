import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    Table,
    UpdatedAt
} from "sequelize-typescript";

import IConfiguration from "common/IConfiguration";
import App from "models/App";

@Table
export default class Entrypoint extends Model<Entrypoint> {
    @Column({
        primaryKey: true
    })
    id: string;

    @ForeignKey(() => App)
    @Column
    appId: string;

    @BelongsTo(() => App)
    app: App;

    @Column({
        allowNull: false,
        unique: true
    })
    urlMatcher: string;

    @Column({
        allowNull: false,
        defaultValue: 0
    })
    urlMatcherPriority: number;

    @Column({
        allowNull: false,
        defaultValue: true
    })
    smartRoutingEnabled: boolean;

    @Column({
        type: DataType.STRING,
        references: { model: "deployments", key: "id" },
        allowNull: true
    })
    activeDeploymentId: string | null;

    @Column({
        type: DataType.JSON,
        allowNull: true
    })
    configuration: IConfiguration | null;

    @CreatedAt createdAt: Date;

    @UpdatedAt updatedAt: Date;
}
