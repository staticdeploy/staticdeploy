// tslint:disable:no-console
import chalk from "chalk";

export default {
    error: (message: string) => {
        if (process.env.NODE_ENV !== "test") {
            console.log(`${chalk.red("error:")} ${message}`);
        }
    },
    success: (message: string) => {
        if (process.env.NODE_ENV !== "test") {
            console.log(`${chalk.green("success:")} ${message}`);
        }
    }
};
