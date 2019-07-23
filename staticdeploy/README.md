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

> Routing configuration

- `MANAGEMENT_HOSTNAME` _(required)_: the hostname at which the management
  console and api will be served
- `HOSTNAME_HEADER`: the header from which to retrieve the hostname of requests
  for static assets. By default `Host` - or `X-Forwarded-Host` if present - are
  used. Some proxies however use other headers to pass the information upstream
  (example: Azure's Verizon CDN uses `X-Host`), so you can use this option to
  make StaticDeploy work behind such proxies

> Auth configurations

- `JWT_SECRET` _(required)_: jwt secret (not base64 encoded)

> Storage configurations

- `POSTGRES_URL`: connection string for the
  [PostgreSQL](https://www.postgresql.org/) database
- `S3_BUCKET`: name of the S3 bucket to use for storing static content
- `S3_ENDPOINT`: endpoint of the S3 server
- `S3_ACCESS_KEY_ID`: access key id for the S3 server
- `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server
