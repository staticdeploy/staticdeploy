---
id: guides-deploying-staticdeploy-with-docker
title: Deploying StaticDeploy with docker
---

StaticDeploy's services are distributed as docker images. The images are
stateless, so it should be straightforward to deploy them on any container
platform like [Kubernetes](https://kubernetes.io/) or
[Amazon ECS](https://aws.amazon.com/ecs/).

The StaticDeploy platform comprises of three services:

- the **api-server**, which exposes an API to manage StaticDeploy's entities
  like bundles and entrypoints. Clients of this service are the
  **admin-console** and the StaticDeploy **cli**
- the **admin-console**, a web GUI for graphically managing StaticDeploy's
  entities
- the **static-server**, the service responsible for serving the bundles at the
  configured entrypoints. Clients of this service are the users which request
  the deployed websites (optionally via a CDN)

The **api-server** and the **static-server** need a persistence layer where they
can store and read back entities and static content. StaticDeploy uses a SQL
database for storing entities, and an S3-API-compatible object storage for
storing static files.

Currently supported SQL databases are [PostgreSQL](https://www.postgresql.org/)
and [SQLite](https://www.sqlite.org/). As for the object storage,
[Amazon S3](https://aws.amazon.com/s3/) can of course be used, as well as any
other API-compatible service like [Minio](https://minio.io/) (which can also act
as gateway for non-compatible services like
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)).

## Running the docker images

The three services listed above are published on the Docker Hub as
`staticdeploy/api-server`,`staticdeploy/admin-console`, and
`staticdeploy/static-server`.

The images can be launched as normal docker images, configured using environment
variables, and inside the containers the services listen on port `80`.

### Configuration

The services take the following configuration options:

- **api-server**

  - `JWT_SECRET`: jwt secret (non base64-encoded) used to verify jwt auth tokens
  - `DATABASE_URL`: connection string for the SQL database (eg
    `postgres://username:password@example.com/database`)
  - `S3_BUCKET`: name of the S3 bucket to use for storing static content
  - `S3_ENDPOINT`: endpoint of the S3 server
  - `S3_ACCESS_KEY_ID`: access key id for the S3 server
  - `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server

- **admin-console**

  - `APP_CONFIG_API_URL`: the base URL of the **api-server**

- **static-server**

  - `DATABASE_URL`: connection string for the SQL database (eg
    `postgres://username:password@example.com/database`)
  - `S3_BUCKET`: name of the S3 bucket to use for storing static content
  - `S3_ENDPOINT`: endpoint of the S3 server (eg ``)
  - `S3_ACCESS_KEY_ID`: access key id for the S3 server
  - `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server
  - `HOSTNAME_HEADER` _(optional)_: the header from which to retrieve the
    hostname of requests. By default `Host` - or `X-Forwarded-Host` if present -
    are used, but some proxies use other headers (for instance Azure's Verizon
    CDN uses `X-Host`)
  - `HEALTH_ROUTE_HOSTNAME` _(optional)_: values of the `Host` header which
    makes the server respond with the health status to a `GET /health` request
    (needed since the server is serving static content on many entrypoints, and
    needs the host + path combination to figure out what to serve)

### Monitoring

We can get the health status of the **api-server** and the **static-server**
with a `GET /health`, with the caveat that for the **static-server** we must
make the request with a `Host` header matching the configured
`HEALTH_ROUTE_HOSTNAME`. The health route responds with a 200 when the services
are healthy, and with a 503 when the services are unhealthy.

For the **admin-console**, a `GET /` can be used to determine the health status.
A 200 response means the service is healthy, while everything else means the
service is unhealthy.

## Generating authentication tokens

To access the admin console, as well as to create and deploy bundles with the
**cli**, we need an authentication token. StaticDeploy uses JWTs as
authentication tokens, with the only requirement that tokens must specify a
`sub` (subject) claim, which is used when logging who's been doing what.

Having chosen a secret to sign tokens with, we can easily generate JWTs with the
**Debugger** widget on [jwt.io](https://jwt.io). Setting the `JWT_SECRET`
configuration options of the **api-server** will make the service reject
requests made without a valid token.

With a valid authentication token we can access the **admin-console** and use
**cli** to deploy static apps.

For instructions on how to do that, see the guide on
[deploying static apps](/docs/guides.deploying-static-apps.html).
