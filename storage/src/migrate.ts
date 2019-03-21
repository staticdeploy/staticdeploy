import { extname, join } from "path";
import Sequelize from "sequelize";
import Umzug from "umzug";

interface ISequelizeMeta {
    name: string;
}
class SequelizeMeta extends Sequelize.Model implements ISequelizeMeta {
    name!: string;
}

export default async function migrate(sequelize: Sequelize.Sequelize) {
    // Migrations can either be in TypeScript (when testing the module) or in
    // javascript (when using the compiled module). Hence they can either be in
    // .ts or in .js files. There is of course a one-to-one equivalence between
    // .ts and .js files.
    //
    // In CI, when testing all of StaticDeploy's modules at once, this 'migrate'
    // function is run both in the source and the compiled form. With default
    // settings Umzug saves and checks executed migrations using the file name
    // of the migration, and therefore executes both the .js and the .ts version
    // of each migration, and since migrations aren't idempotent, breaks.
    //
    // To avoid this, we make so the saved migration name is always the .js
    // version, and the read migration name is .ts when running the .ts version
    // of this function, .js when running the .js version
    SequelizeMeta.init(
        {
            name: {
                type: Sequelize.STRING,
                primaryKey: true,
                get(this: SequelizeMeta) {
                    return this.getDataValue("name").replace(
                        ".js",
                        extname(__filename)
                    );
                },
                set(this: SequelizeMeta, name: string) {
                    this.setDataValue("name", name.replace(".ts", ".js"));
                }
            }
        },
        {
            sequelize: sequelize,
            tableName: "SequelizeMeta",
            timestamps: false
        }
    );

    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: { model: SequelizeMeta },
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

    // Perform 'up' migrations
    await umzug.up();
}
