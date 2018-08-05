---
id: reference-entities
title: Entities
---

### Bundles

Bundles are tar.gz archives of static content (assets), plus associated metadata
describing the archives (a name, a tag, a description, etc.). Conceptually
bundles are equivalent to docker images.

Bundles must specify a fallback asset, an asset that will be served to requests
that don't match any other asset, as well as the status code to use when serving
it.

Bundles can also specify custom headers to be used by StaticDeploy when serving
their assets.

Bundles can be created with the `bundle` command of the StaticDeploy cli, by
giving it a folder that gets archived into a tar.gz and uploaded to the
StaticDeploy backend.

### Entrypoints

Entrypoints are the urls at which StaticDeploy serves the static content of
bundles. Each entrypoint is usually characterized by two properties:

- `bundleId`: the id of the bundle to serve
- `urlMatcher`: a domain + path combination against which incoming requests are
  matched to determine wether or not they should be served the static content of
  the entrypoint's bundle

Entrypoints may specify a configuration, a `(string, string)` dictionary that is
injected at serve-time into the html files of the bundle.

Entrypoints can be created manually from StaticDeploy's admin console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy cli.

Entrypoints may specify a `redirectTo`, instead of a `bundleId`. If a
`redirectTo` is specified, for that entrypoint StaticDeploy doesn't serve a
static bundle, but instead issues a 302 with the `redirectTo` as `Location`.

### Apps

Apps are groups of entrypoints. Apps define a default configuration to be used
for entrypoints which don't define one.

Apps can be created manually from StaticDeploy's admin console, or automatically
when deploying a bundle with the `deploy` command of the StaticDeploy cli.

### Operation Logs

Operation logs are immutable records of the write operations performed by the
administrators of a StaticDeploy instance. Each time one of the entities above
is created, updated, or deleted, an operation log is written specifying the
operation that was performed, the user who performed it, the time at which it
was performed, and additional information that details exactly what was done.
