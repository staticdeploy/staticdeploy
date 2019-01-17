## 0.11.1 (January 17, 2019)

Fixes:

- in the **admin-console**, hide the no-data placeholder of tables

## 0.11.0 (January 16, 2019)

Features:

- implement deleting bundles by **name:tag** combination
- **admin-console**:
  - show operation logs details
  - show bundles details
  - optimize bundles retrieval
  - client-side paginate long lists
  - allow setting an entrypoint's bundle
  - in an entrypoint's details, link to urlMatcher and redirectTo

## 0.10.0 (October 14, 2018)

Features:

- publish `staticdeploy/cli` docker image with **cli** pre-installed
- add healthchecks to `staticdeploy/api-server` and `staticdeploy/static-server`
  docker images

## 0.9.1 (August 9, 2018)

Fixes:

- correctly parse **cli** `bundle` command `headers` option (fixes #24)

## 0.9.0 (August 6, 2018)

Breaking changes:

- renamed **cli** command `create-bundle` to `bundle`

Features:

- allow passing options to the **cli** via config file
- allow specifying a custom status code for the fallback asset
- allow specifying custom headers for bundle assets
- make [staticdeploy.io](https://staticdeploy.io) GDPR compliant

## 0.8.0 (June 19, 2018)

Breaking changes:

- bundles must now specify a fallback asset, that will be served to requests not
  matching any other asset. The fallback asset used to be statically set to
  `/index.html`, even for bundles not having an `/index.html` asset. Now it must
  be specified at bundle creation time (note: the StaticDeploy **cli** defaults
  it to `/index.html` if the asset exists in the bundle being created). For
  bundles created with StaticDeploy <= 0.7.0, SQL migrations set the fallback
  asset to `/index.html`. If those bundles don't contain the asset, requesting
  it will result in a 500 HTTP error (with StaticDeploy <= 0.7.0 it would have
  been a 404). The decision to let a 500 slip instead of handling the error and
  responding with a more correct 404 was made because handling the special case
  would have complicated the already complex routing algorithm, and because
  actually we don't expect there to be any such cases deployed

- routing algorithm changes:
  - when serving a bundle containing assets `/path` and `/path.html`, requests
    for `/path` will get the `/path` asset, not the `/path.html` asset (used to
    be the other way around)
  - when serving a bundle containing assets `/path.html` and `/path/index.html`,
    requests for `/path` will get the `/path.html` asset, not the
    `/path/index.html` asset (used to be the other way around)

Features:

- fallback asset for bundles (see breaking change)
- improved routing algorithm (see breaking change)

## 0.7.0 (June 2, 2018)

Breaking changes:

- using the local filesystem to store static content is no longer supported

Features:

- also support PostgreSQL as SQL database
- use S3 (and API-compatible object storage services) for storing static files
- add `HOSTNAME_HEADERS` option to configure how requests for static content are
  routed

## 0.6.2 (May 24, 2018)

Fixes:

- increase CLI request body limit (fixes issue #11)

## 0.6.1 (May 22, 2018)

Fixes:

- fix descriptions for CLI commands and options
- fix html title in admin console

## 0.6.0 (May 19, 2018)

Features:

- reduce CLI installation size, speeding up installation

## 0.5.0 (May 19, 2018)

Features:

- add logo
- improve theme for docs website

Fixes:

- fix label in admin-console entrypoint edit / create form

## 0.4.0 (May 16, 2018)

Features:

- allow more characters (dots and slashes) to be used in apps names

## 0.3.0 (May 16, 2018)

Features:

- entrypoint redirects: now an entrypoint can specify either a bundle to serve
  or an url to redirect (302) to

## 0.2.0 (May 16, 2018)

Features:

- operation logs (for write operations)

## 0.1.0 - 0.1.1 (March 27, 2018)

Initial release.
