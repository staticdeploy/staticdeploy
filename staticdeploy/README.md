# @staticdeploy/staticdeploy

Main service of the StaticDeploy platform.

## Run

The service is distributed as a Docker image (`staticdeploy/staticdeploy`) that
can be run without modifications on docker-compose, ECS, Kubernetes, etc.

You can check the health status of the service via
`GET $MANAGEMENT_HOSTNAME/api/health`: the server will return a `200` if the
service is in a healthy status, a `503` otherwise. If the request is
authenticated, the (json) body of the response contains details about the health
status.

## Configure

The following environment variables can be used to configure the server:

> General service configurations

- `LOG_LEVEL` (defaults to `info`)
- `MANAGEMENT_HOSTNAME` _(required)_: the hostname at which the Management
  Console and API will be served

> Routing configurations

- `ENABLE_MANAGEMENT_ENDPOINTS`: whether to enable or not the Management Console
  and API. Defaults to `true`
- `HOSTNAME_HEADER`: the header from which to retrieve the hostname of requests
  for static assets. By default `Host` - or `X-Forwarded-Host` if present - are
  used. Some proxies however use other headers to pass the information upstream
  (example: Azure's Verizon CDN uses `X-Host`), so you can use this option to
  make StaticDeploy work behind such proxies

> Auth configurations

- `ENFORCE_AUTH`: `true` or `false`, determines whether authentication and
  authorization are enforced (i.e. requests must be authenticated, and the user
  performing the request must have the appropriate roles). Defaults to `true`
- `CREATE_ROOT_USER`: on startup, create (if they don't already exist) a `root`
  user and group with the `root` role. Defaults to `true`
- `JWT_SECRET_OR_PUBLIC_KEY`: by setting this config the JWT authentication
  strategy will be enabled. The config is the secret or public key (base64
  encoded) to validate authorization JWT-s
- `OIDC_CONFIGURATION_URL`: by setting this config (and the following one) the
  OpenID Connect authentication strategy will be enabled. The config is the
  configuration url of the OpenID Connect provider (e.g.
  `https://example.com/.well-known/openid-configuration`)
- `OIDC_CLIENT_ID`: the client id of the OpenID Connect application
- `OIDC_PROVIDER_NAME`: the name to show in the "Login with" interface

> pg-s3 storages configurations

When setting these config (all of them), the pg-s3 storages module will be
enabled (the memory one is used otherwise):

- `POSTGRES_URL`: connection string for the
  [PostgreSQL](https://www.postgresql.org/) database
- `S3_BUCKET`: name of the S3 bucket to use for storing static content
- `S3_ENDPOINT`: endpoint of the S3 server
- `S3_ACCESS_KEY_ID`: access key id for the S3 server
- `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server
