# @staticdeploy/cli

CLI tool to create and deploy bundles. The tool calls the APIs exposed by
StaticDeploy's **api-server**.

## Install

```sh
npm i -g @staticdeploy/cli
```

## Use

* `staticdeploy create-bundle`: creates a bundle and uploads it to the
  StaticDeploy server. Options (all required):

  * `--apiUrl`: URL of the StaticDeploy **api-server**
  * `--apiToken`: authentication token for the API
  * `--from`: path of the directory to create the bundle from
  * `--name`: name of the bundle
  * `--tag`: tag of the bundle
  * `--description`: description of the bundle

* `staticdeploy deploy`: deploys a bundle to an entrypoint. Options (all
  required):

  * `--apiUrl`: URL of the StaticDeploy **api-server**
  * `--apiToken`: authentication token for the API
  * `--bundle`: name:tag combination of the bundle to deploy
  * `--entrypoint`: urlMatcher of the entrypoint to deploy to
  * `--app`: name of the app the entrypoint links to

Options can also be passed as upper-cased, snake-cased, environment variables
prefixed by `STATICDEPLOY_`. Eg:

```sh
export STATICDEPLOY_API_URL=...
export STATICDEPLOY_API_TOKEN=...
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
