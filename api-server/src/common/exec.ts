import { exec } from "child_process";
import { promisify } from "util";

export default promisify(exec);
