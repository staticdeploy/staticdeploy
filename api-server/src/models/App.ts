import {
    Column,
    CreatedAt,
    DataType,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";

import IConfiguration from "common/IConfiguration";

@Table
export default class App extends Model<App> {
    @PrimaryKey
    @Column
    id: string;

    @Column name: string;

    @Column({ type: DataType.JSON })
    defaultConfiguration: IConfiguration;

    @CreatedAt createdAt: Date;

    @UpdatedAt updatedAt: Date;
}
