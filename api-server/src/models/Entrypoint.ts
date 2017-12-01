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
export default class Entrypoint extends Model<Entrypoint> {
    @PrimaryKey
    @Column
    id: string;

    @Column appId: string;

    @Column urlMatcher: string;

    @Column urlMatcherPriority: number;

    @Column smartRoutingEnabled: boolean;

    @Column({ type: DataType.STRING })
    activeDeploymentId: string | null;

    @Column({ type: DataType.JSON })
    configuration: IConfiguration | null;

    @CreatedAt createdAt: Date;

    @UpdatedAt updatedAt: Date;
}
