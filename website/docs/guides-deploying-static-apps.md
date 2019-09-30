---
id: guides-deploying-static-apps
title: Deploying static apps
---

[Having set up the StaticDeploy platform](/docs/guides-deploying-staticdeploy-with-docker),
you can now deploy your static apps on it.

> **Note**: this guide assumes you have the **staticdeploy** service listening
> at `https://staticdeploy.$MY_DOMAIN/`

## Setting up the CLI

Apps are deployed using the StaticDeploy CLI, which you can install from npm:

```sh
npm install --global @staticdeploy/cli
# Or, if you prefer yarn
yarn global add @staticdeploy/cli
```

You need to provide the CLI the address of your StaticDeploy Management API, as
well as a valid authentication token for making requests to it. You can do so by
setting two environment variables:

```sh
export STATICDEPLOY_API_URL=https://staticdeploy.$MY_DOMAIN/api/
export STATICDEPLOY_API_TOKEN=my-jwt-auth-token
```

## Deploying a static app

Deploying a static app is a two step process.

First, you need to create a bundle from the folder containing your static app.
You can do so with the `bundle` command of the CLI, to which you also provide -
aside from the folder where your app is located - a name for the bundle, a tag,
a description, and the path of the fallback asset (which must exist in the
bundle):

```sh
staticdeploy bundle
  --from my-static-app-folder
  --name my-static-app
  --tag master
  --description "First bundle"
  # If your fallback asset actually is /index.html, you can omit this option
  # since it defaults to /index.html
  --fallbackAssetPath /index.html
```

The command will package the static app into a tar.gz archive and upload it to
the StaticDeploy platform, where it can now be deployed.

You can do so using the `deploy` command of the CLI. The command takes three
arguments:

- a name for the app you want to deploy
- an entrypoint (i.e. a URL) where you want to deploy your app
- the name of the bundle that you wish to deploy to that entrypoint

```sh
staticdeploy deploy
  --app my-static-app
  --entrypoint my-static-app.com/
  --bundle my-static-app:master
```

The command will deploy the latest bundle with name `my-static-app` and tag
`master` to the entrypoint `my-static-app.com/`.

## Pointing the DNS to StaticDeploy's static-server

Now that you've deployed your static app, when the **staticdeploy** service
receives requests for `my-static-app.com/`, it will respond with the appropriate
file in the bundle you've deployed.

First though you need to make requests for `my-static-app.com/` get to the
service, by pointing the DNS of `my-static-app.com` to it.

## Improving performances with a CDN

Maybe surprisingly given its name, StaticDeploy is not very efficient at serving
static files: its main jobs are correctly routing requests and injecting
configurations. It also doesn't serve content via HTTPS. This is by design,
since StaticDeploy is supposed to be used - at least for production
deployments - in combination with a CDN, a tool whose purpose is to optimize and
secure serving static files.

Using a CDN with StaticDeploy is fairly simple: you just need to set your
**staticdeploy** service installation as the _origin_ from which the CDN gets
the content, point the DNS of your app to the CDN, and configure the CDN to
pass-through the `Host` header of requests
([headers other than `Host` are also supported](/docs/guides-deploying-staticdeploy-with-docker#routing-configurations)).
