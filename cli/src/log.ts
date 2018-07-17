// tslint:disable:no-console
import chalk from "chalk";

export default {
    error: (message: string) => {
        if (process.env.NODE_ENV !== "test") {
            message
                .split("\n")
                .forEach(line => console.log(`${chalk.red("error:")} ${line}`));
        }
    },
    success: (message: string) => {
        if (process.env.NODE_ENV !== "test") {
            message
                .split("\n")
                .forEach(line =>
                    console.log(`${chalk.green("success:")} ${line}`)
                );
        }
    }
};
