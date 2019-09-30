---
id: getting-started-overview
title: Overview
---

StaticDeploy is an open-source platform for deploying static web applications
and websites. You can think of it as a Kubernetes for static content.

StaticDeploy was created with two objectives in mind:

- make it easy to configure a static app at **runtime**, as opposed to injecting
  the configuration into it at **build time**

- make it easy to deploy multiple "versions" of a static app, specifically a
  version for each branch / pull request, so that frontend developers can show
  their work-in-progress and get early feedback from their clients

Before finding out how StaticDeploy reaches these goals, let's get an idea of
the entities StaticDeploy deals with.

## Entities

### Bundles

Bundles are archives of static content (assets), plus associated metadata
describing the archives (a name, a tag, a description, etc.). Conceptually
bundles are equivalent to docker images.

Bundles must specify a fallback asset, an asset that will be served to requests
that don't match any other asset.

Bundles can be created with the `bundle` command of the StaticDeploy CLI, by
giving it a folder that gets packed into an archive and uploaded to the
StaticDeploy backend.

<div class="paddedDocsImage">
  <img
    src="../images/bundles-screenshot.png"
    alt="Browsing bundles in the Management Console"
  />
</div>

### Entrypoints

Entrypoints are the urls at which the StaticDeploy backend serves the static
content of bundles. Each entrypoint is characterized by two properties:

- `bundleId`: the id of the bundle to serve
- `urlMatcher`: a domain + path combination against which incoming requests are
  matched to determine whether or not they should be served the static content
  of the entrypoint's bundle

Entrypoints may specify a configuration, a `(string, string)` dictionary that is
injected at serve-time into the html files of the bundle.

Entrypoints can be created manually from StaticDeploy's Management Console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy CLI.

<div class="paddedDocsImage">
  <img
    src="../images/entrypoints-screenshot.png"
    alt="Browsing apps and entrypoints in the Management Console"
  />
</div>

### Apps

Apps are groups of entrypoints. Apps define a default configuration to be used
for entrypoints which don't define one.

Apps can be created manually from StaticDeploy's Management Console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy CLI.

## Reaching the goals

### Runtime configuration

As written above, each entrypoint has a configuration object that gets injected
into the html files of the entrypoint's bundle when they're being served. To
allow StaticDeploy to do so, you simply have to define - in the html files which
you want to be "configured" - a `<script>` element with id `app-config`.
StaticDeploy will inject into the element a javascript snippet defining the
global variable `window.APP_CONFIG` and assigning it the value of the
configuration object.

#### Example

<div class="splitter gettingStartedOverviewSplitter">
<div class="left">
Source html:

```html
<head>
  <script id="app-config"></script>
  <!-- ... -->
</head>
```

</div>
<div class="right">
Served html:

```html
<head>
  <script id="app-config">
    window.APP_CONFIG = {
      /* ... */
    };
  </script>
  <!-- ... -->
</head>
```

</div>
</div>

The [configuration page](/docs/getting-started-apps-configuration) of the
documentation goes in more details about how configuration works.

### Multiple versions

Bundles and entrypoints are very "cheap" objects in StaticDeploy: you can have
thousands of them without incurring into significant performance degradation.

This means you can create bundles for every commit of every app you deploy on
StaticDeploy. And you could deploy each bundle to a unique entrypoint, though
you might prefer to take different approaches, like having one entrypoint for
each branch of each app.

Creating a bundle is quite simple, and you would typically do it on your CI
server after building your app. For instance, for a
[react app](https://create-react-app.dev) you would do something like:

```sh
# Build the app, saving static artifacts into the build/ folder
npm run build
# Create a bundle from that folder
staticdeploy bundle
  --from build/
  --name example-app
  --tag $BRANCH
  --description "Build of commit $COMMIT"
```

Deploying bundles is equally easy, and StaticDeploy allows you to choose
whichever url scheme you want for deploying your apps' versions. For instance,
for deploying each branch of the example react app above, in your CI server
you'd run:

```sh
staticdeploy deploy
  --app example-app
  --entrypoint $BRANCH.example-app.com/
  --bundle example-app:$BRANCH
```

But you could choose different url schemes for the app's entrypoints, like
`prefix-$BRANCH.example-app.com/` or `example-app.com/$BRANCH/`.

The [workflow page](/docs/getting-started-cicd-workflows) of the documentation
explores different workflows for deploying static apps.
