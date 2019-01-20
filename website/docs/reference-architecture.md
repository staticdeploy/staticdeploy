---
id: reference-architecture
title: Architecture
---

The following diagram represents the logical architecture of the StaticDeploy
platform:

<div class="padded-docs-image">
  <img
    src="../images/architecture.svg"
    alt="StaticDeploy Architecture"
  />
</div>

On the server side, we have:

- the **api-server**, which exposes an API to manage StaticDeploy's entities
  like bundles and entrypoints. Clients of this service are the
  **admin-console** and **cli**
- the **static-server**, the service responsible for serving the bundles at the
  configured entrypoints. Clients of this service are the users which request
  the deployed websites (optionally via a CDN)

On the client side, we have:

- the **admin-console**, which allows us to graphically manage StaticDeploy's
  entities. The **admin-console** communicates with the **api-server**
- the **cli**, which we can use to create and deploy bundles. The **cli** also
  communicates with the **api-server**
- end users requesting websites we've deployed. End users direct requests to the
  **static-server**

The **storage** layer is comprised of two parts:

- a relational database, used to store StaticDeploy's entities
- a file storage service, used to store the static content of bundles

StaticDeploy currently supports [PostgreSQL](https://www.postgresql.org/) and
[SQLite](https://www.sqlite.org/) as relational databases, and
[Amazon S3](https://aws.amazon.com/s3/) (and API-compatible servers like
[Minio](https://minio.io)) as file storage service.
