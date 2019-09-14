import StaticdeployClient from "@staticdeploy/sdk";
import React from "react";

export default React.createContext<StaticdeployClient | null>(null);
