## 0.15.4 (December 16, 2020)

Features:

- allow configuring the max request body size accepted by the server, which
  mainly limits the size of bundles that can be uploaded

Fixes:

- fix sdk regression caused by
  [axios/axios#2781](https://github.com/axios/axios/pull/2781), which broke
  uploading bundles larger than ~2MB

## 0.15.3 (December 12, 2020)

Fixes:

- correctly handle requests having a trailing dot in their hostname (#31)
- in the Management Console, handle bundle names and tags containing `/` and
  other special characters (#65)
- only allow GET and HEAD methods for requesting assets (#66)

## 0.15.2 (April 8, 2020)

Fixes:

- fix OIDC token renewal logic caused by `oidc-client` library bug

## 0.15.1 (April 8, 2020)

Features:

- slight design update of the Management Console

Fixes:

- make the OIDC authentication strategy handle JWKS rollovers

## 0.15.0 (January 24, 2020)

Features:

- inject the base path of the entrypoint at which the html page is being served
  as the `BASE_PATH` property of the `window.APP_CONFIG` object
- when a Content-Security-Policy header is defined for an html asset, patch its
  value to whitelist (via sha256 source) the configuration script injected in
  the html

## 0.14.1 (November 29, 2019)

Fixes:

- fix HTTP 400 error when updating an app
- render spinner while auth service is initializing

## 0.14.0 (November 23, 2019)

Features:

- change `app-manager` role target to `appName` instead of `appId`
- support wildcard roles for matching apps and bundles names

BREAKING CHANGES:

- change `app-manager` role target to `appName` instead of `appId`
- remove possibility to change an app's name

## 0.13.2 (September 20, 2019)

Features:

- improve the automatic refresh of the OpenID Connect auth token

## 0.13.1 (September 16, 2019)

Features:

- refresh OpenID Connect auth token automatically (when possible)
- improve login error message telling a would-be user that they need to be
  registered as a user before being able to login

Fixes:

- fix styling of long errors in Management Console operation modals

## 0.13.0 (September 11, 2019)

Features:

- role-based access control for write operations (with the option to disable
  auth enforcement)
- login with an OpenID Connect Provider
- new logo and other graphic improvements (credits to
  [@Pendulla](https://github.com/pendulla))
- allow not exposing management endpoints

BREAKING CHANGES:

- remove the possibility to update an entrypoint's `appId` and `urlMatcher`
- remove the possibility to delete an app that has linked entrypoints
- the new method of authenticating users is not compatible with old auth tokens

## 0.12.2 (August 28, 2019)

Fixes:

- disable x-powered-by in all express apps

## 0.12.1 (August 28, 2019)

Fixes:

- fix redirects when serve-static is not mounted at /

## 0.12.0 (July 23, 2019)

Refactors:

- restructure the project to follow the
  [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
  principles
- switch to [Knex.js](https://knexjs.org/) (from
  [Sequelize](http://docs.sequelizejs.com/)) for sql operations

BREAKING CHANGES:

- the project is now distributed as the single docker image
  `staticdeploy/staticdeploy` instead of the three images
  `staticdeploy/api-server`, `staticdeploy/static-server`, and
  `staticdeploy/admin-console`
- the `staticdeploy/staticdeploy` image requires a slightly different
  configuration than the previous three images. Refer to
  [the documentation](https://staticdeploy.io/_/v0.12.0/docs/guides-deploying-staticdeploy-with-docker)
  for details
- SQLite is not supported anymore as a databse
- due to the SQL migrations library having changed, a _migration of the saved
  migrations_ must be done manually on existing PostgreSQL databases. If you're
  in this situation, open an issue asking for support

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

BREAKING CHANGES:

- renamed **cli** command `create-bundle` to `bundle`

Features:

- allow passing options to the **cli** via config file
- allow specifying a custom status code for the fallback asset
- allow specifying custom headers for bundle assets
- make [staticdeploy.io](https://staticdeploy.io) GDPR compliant

## 0.8.0 (June 19, 2018)

BREAKING CHANGES:

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

BREAKING CHANGES:

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
