import { Column, DataType, Model, Table } from "sequelize-typescript";

export const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            pattern: "^[a-zA-Z0-9-]+$",
            minLength: 1,
            maxLength: 255
        },
        defaultConfiguration: {
            type: "object",
            patternProperties: { ".*": { type: "string" } },
            additionalProperties: false
        }
    },
    required: ["name"],
    additionalProperties: false
};

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
    defaultConfiguration: {
        [key: string]: string;
    };
}
