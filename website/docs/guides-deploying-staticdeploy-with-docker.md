---
id: guides-deploying-staticdeploy-with-docker
title: Deploying StaticDeploy with docker
---

StaticDeploy's is distributed as the single docker image
`staticdeploy/staticdeploy:$VERSION` (e.g. `staticdeploy/staticdeploy:v0.12.0`).
The image is stateless, so it should be straightforward to deploy it on any
container platform like [Kubernetes](https://kubernetes.io/) or
[Amazon ECS](https://aws.amazon.com/ecs/).

The image contains the **staticdeploy** service that hosts:

- the **management API**, a RESTful API to manage StaticDeploy's entities like
  bundles and entrypoints. Clients of this API are the **management console**
  and the StaticDeploy **cli**
- the **management console**, a web GUI for graphically managing StaticDeploy's
  entities
- the **static server**, the component responsible for serving the assets
  deployed on StaticDeploy. Clients of this server are end-users accessing the
  deployed websites

The service needs a persistence layer (storages) where it can store and read
back entities and static content. Currently it ships with two storages:

- `pg-s3-storages`: a persistence layer backed by
  [PostgreSQL](https://www.postgresql.org/) and
  [Amazon S3](https://aws.amazon.com/s3/) (or any other API-compatible service
  like [Minio](https://minio.io/))
- `memory-storages`: an in-memory "persistence" layer

For any kind of non-demo deployment you're probably going to use the
`pg-s3-storages` module, that can be enabled just by setting the appropriate
configuration options.

### Configuration

The **staticdeploy** service accepts the following configuration options:

- `MANAGEMENT_HOSTNAME` _(required)_: the hostname at which the management
  console and the management API will be served
- `JWT_SECRET` _(required)_: secret to verify jwt signatures (not base64
  encoded)
- `POSTGRES_URL`: connection string for the
  [PostgreSQL](https://www.postgresql.org/) database
- `S3_BUCKET`: name of the S3 bucket to use for storing static content
- `S3_ENDPOINT`: endpoint of the S3 server
- `S3_ACCESS_KEY_ID`: access key id for the S3 server
- `S3_SECRET_ACCESS_KEY`: secret access key for the S3 server
- `HOSTNAME_HEADER`: the header from which to retrieve the hostname of requests
  for static assets. By default `Host` - or `X-Forwarded-Host` if present - are
  used. Some proxies however use other headers to pass the information upstream
  (example: Azure's Verizon CDN uses `X-Host`), so you can use this option to
  make StaticDeploy work behind such proxies
- `LOG_LEVEL` (defaults to `info`)

### Monitoring

You can check the health status of the **staticdeploy** service via
`GET $MANAGEMENT_HOSTNAME/api/health`: the server will return a `200` if the
service is in a healthy status, a `503` otherwise. If the request is
authenticated, the (json) body of the response contains details about the health
status

## Generating authentication tokens

To access the management console, as well as to create and deploy bundles with
the **cli**, we need an authentication token. **staticdeploy** uses JWTs as
authentication tokens, with the only requirement that tokens must specify a
`sub` (subject) claim, which is used when logging who's been doing what.

Having chosen a secret to sign tokens with, we can easily generate JWTs with the
**Debugger** widget on [jwt.io](https://jwt.io).

With a valid authentication token we can access the management console and use
the cli to deploy static apps.

For instructions on how to do that, see the guide on
[deploying static apps](/docs/guides-deploying-static-apps).
