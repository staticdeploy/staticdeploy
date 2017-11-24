# staticdeploy-sdk

staticdeploy sdk for nodejs and the browser.

## Install

```sh
yarn add @staticdeploy/sdk
```

## Quickstart

```ts
import StaticdeployClient from "@staticdeploy/sdk";

const client = new StaticdeployClient({
    apiUrl: process.env.STATICDEPLOY_API_URL,
    apiToken: process.env.STATICDEPLOY_API_TOKEN
});

/* In some async function... */

const apps = await client.apps.getAll();
console.log(apps);

const createdApp = await client.apps.create({ name: "my-app" });
console.log(createdApp);
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
