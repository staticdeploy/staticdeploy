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
            // Migration source files are named DD.ts, where D is a digit. When
            // they're compiled, they become DD.js. We want to only load those
            // files, and not other files such as *.d.ts ones
            pattern: /^\d{2}\.(js|ts)$/
        },
        logging: false
    });
    await umzug.up();
}
