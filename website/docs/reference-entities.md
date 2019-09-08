---
id: reference-entities
title: Entities
---

### Bundles

Bundles are archives of static content (assets), plus associated metadata
describing the archives (a name, a tag, a description, etc.). Conceptually
bundles are equivalent to docker images.

Bundles must specify a fallback asset, an asset that will be served to requests
that don't match any other asset, as well as the status code to use when serving
it.

Bundles can also specify custom headers to be used by StaticDeploy when serving
their assets.

Bundles can be created with the `bundle` command of the StaticDeploy CLI, by
giving it a folder that gets packed into an archive and uploaded to the
StaticDeploy backend.

### Entrypoints

Entrypoints are the urls at which StaticDeploy serves the static content of
bundles. Each entrypoint is usually characterized by two properties:

- `bundleId`: the id of the bundle to serve
- `urlMatcher`: a domain + path combination against which incoming requests are
  matched to determine whether or not they should be served the static content
  of the entrypoint's bundle

Entrypoints may specify a configuration, a `(string, string)` dictionary that is
injected at serve-time into the html files of the bundle.

Entrypoints can be created manually from StaticDeploy's Management Console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy CLI.

Entrypoints may specify a `redirectTo`, instead of a `bundleId`. If a
`redirectTo` is specified, for that entrypoint StaticDeploy doesn't serve a
static bundle, but instead issues a 302 with the `redirectTo` as `Location`.

### Apps

Apps are groups of entrypoints. Apps define a default configuration to be used
for entrypoints which don't define one.

Apps can be created manually from StaticDeploy's Management Console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy CLI.

### Operation Logs

Operation logs are immutable records of the write operations performed by the
users of a StaticDeploy instance. Each time one of the entities above is
created, updated, or deleted, an operation log is written specifying the
operation that was performed, the user who performed it, the time at which it
was performed, and additional information that details exactly what was done.

### Users

Users are the users of the StaticDeploy Management Console and API. StaticDeploy
is not an identity provider (IdP), so its users are only **references** to users
of an external IdP. In fact, when you create a user in StaticDeploy you need to
specify the IdP that user belongs to (`idp`), as well as the user identifier for
the IdP (`idpId`).

These user references have additional information attached to them, which are
used for organization and authorization purposes:

- `name`: a human-friendly identifier of the user
- `type`: can either be `human` or `machine`, it allows to distinguish between
  machine users like a CI server, and human users like an admin
- `groups`: a list of groups the user belongs to. Each group has a set of roles
  attached, which allow to perform certain operations

### Groups

Groups are named collections of authorization roles, which can be assigned to
users to allow them to perform certain operations. See the
[Authentication and Authorization](/docs/reference-authentication-and-authorization)
reference to understand how roles are used for authorizing operations.
