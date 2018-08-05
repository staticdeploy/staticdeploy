---
id: reference-cli
title: Using StaticDeploy's CLI
---

The StaticDeploy **cli** is distributed via [npm](https://npmjs.com), and we can
install it with a simple `npm install --global @staticdeploy/cli`. After running
the command, the `staticdeploy` executable will be available in our shell's
`$PATH`.

## Using the staticdeploy executable

`staticdeploy` has two commands: `bundle` and `deploy`.

### staticdeploy bundle

Creates a bundle and uploads it to the StaticDeploy server. It takes the
following options:

- `--config` (optional): specify the file from which to load options. Defaults
  to `staticdeploy.config.js` (if it exists)
- `--apiUrl`: URL of the StaticDeploy **api-server**
- `--apiToken`: authentication token for the API
- `--from`: path of the directory to create the bundle from
- `--name`: name of the bundle
- `--tag`: tag of the bundle
- `--description`: description of the bundle
- `--fallbackAssetPath` (optional): absolute path (relative to the `from`
  directory) of the asset to use as fallback when requests don't match any other
  asset. Defaults to `/index.html`, but the asset MUST exist
- `--fallbackStatusCode` (optional): status code to use when serving the
  fallback asset. Defaults to `200`
- `--headers` (optional): `(asset matcher, headers)` map specifying which
  headers to assign to which assets

### staticdeploy deploy

Deploys a bundle to an entrypoint. It takes the following options:

- `--config` (optional): specify the file from which to load options. Defaults
  to `staticdeploy.config.js` (if it exists)
- `--apiUrl`: URL of the StaticDeploy **api-server**
- `--apiToken`: authentication token for the API
- `--bundle`: name:tag combination of the bundle to deploy
- `--entrypoint`: urlMatcher of the entrypoint to deploy to
- `--app`: name of the app the entrypoint links to

## Using a config file

As seen above, we can supply options to `staticdeploy` in a config file. A valid
config file has the following structure:

```js
module.exports = {
  // Optional
  bundle: {
    // Options for the bundle command as specified above
  },
  // Optional
  deploy: {
    // Options for the deploy command as specified above
  }
};
```

## Using environment variables

Options can also be passed as upper-cased, snake-cased, environment variables
prefixed by `STATICDEPLOY_`. Eg:

```sh
export STATICDEPLOY_API_URL=...
export STATICDEPLOY_API_TOKEN=...
```

## Options sources priority

Option sources have the following priority:

1.  command line flags
2.  environment variables
3.  configuration defined in the config file

Meaning for example that when an option is provided both as a command line flag
and as an environment variable, the value provided with the command line flag is
used.
