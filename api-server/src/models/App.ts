import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt
} from "sequelize-typescript";

import IConfiguration from "common/IConfiguration";

@Table
export default class App extends Model<App> {
    @Column({
        primaryKey: true
    })
    id: string;

    @Column({
        allowNull: false,
        unique: true
    })
    name: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: {}
    })
    defaultConfiguration: IConfiguration;

    @CreatedAt createdAt: Date;

    @UpdatedAt updatedAt: Date;
}
