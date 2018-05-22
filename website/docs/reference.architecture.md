---
id: reference.architecture
title: Architecture
---

The following diagram represents the logical architecture of the StaticDeploy
platform:

<br />
![Architecture](../images/architecture.svg)
<br />

On the server side, we have:

* the **api-server**, which exposes an API to manage StaticDeploy's entities
  like bundles and entrypoints. Clients of this service are the
  **admin-console** and **cli**
* the **static-server**, the service responsible for serving the bundles at the
  configured entrypoints. Clients of this service are the users which request
  the deployed websites (optionally via a CDN)

On the client side, we have:

* the **admin-console**, which allows us to graphically manage StaticDeploy's
  entities. The **admin-console** communicates with the **api-server**
* the **cli**, which we can use to create and deploy bundles. The **cli** also
  communicates with the **api-server**
* end users requesting websites we've deployed. End users direct requests to the
  **static-server**

The **storage** layer is comprised of two parts:

* a relational database, used to store StaticDeploy's entities
* a file storage, used to store the static content of bundles

Currently StaticDeploy only supports [sqlite](https://www.sqlite.org/) as the
relational database, and the local filesystem as the file storage.
