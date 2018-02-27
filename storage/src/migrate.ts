import { join } from "path";
import { Sequelize } from "sequelize";
import Umzug from "umzug";

export default async function migrate(sequelize: Sequelize) {
    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize: sequelize
        },
        migrations: {
            params: [sequelize.getQueryInterface()],
            path: join(__dirname, "./migrations"),
            pattern: /\.migration\.(js|ts)$/
        },
        logging: false
    });
    await umzug.up();
}
