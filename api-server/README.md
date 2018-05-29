# @staticdeploy/api-server

This service implements the StaticDeploy API, through which admin users can
manage StaticDeploy's entities (bundles, apps, entrypoints, and operation logs).

Clients of this API are StaticDeploy's **admin-console** and **cli**.

## Run

The service is distributed as a Docker image (`staticdeploy/api-server`) that
can be run without modifications on docker-compose, ECS, Kubernetes, etc.

You can check the health status of the service via `GET /health`: the server
will return a `200` if the service is in a healthy status, a `503` otherwise.
The (json) body of the response contains details about the health status. When a
valid `access_token` is provided in the request querystring, more status details
are returned.

## Configure

The following environment variables can be used to configure the server:

> General service configurations

- `NODE_ENV` (defaults to `development`)
- `LOG_LEVEL` (defaults to `info`)
- `HOSTNAME` (defaults to `localhost`)
- `PORT` (defaults to `3000`): network port to attach to
- `HEALTH_ROUTE_ACCESS_TOKEN`: the token that allows getting the detailed health
  status of the service

> Auth configurations

- `JWT_SECRET`: jwt secret (not base64 encoded), defaults to `secret`

> Storage configurtations

- `DATABASE_URL`: database connection string. Supported databases are
  [sqlite](https://www.sqlite.org/) and
  [postgresql](https://www.postgresql.org/)
- `S3_BUCKET`: name of the S3 bucket to use for storing static content, defaults
  to `staticdeploy`
- `S3_ENDPOINT`: endpoint of the S3 server
- `S3_ACCESS_KEY_ID`: access key id for the S3 server
- `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
