---
id: reference-architecture
title: Architecture
---

The following diagram represents the functional architecture of the StaticDeploy
platform:

<div class="paddedDocsImage">
  <img
    src="../images/functional-architecture.svg"
    alt="StaticDeploy Functional Architecture"
  />
</div>

- the **management API** is a RESTful API to manage StaticDeploy's entities like
  bundles and entrypoints
- the **management console** is a web GUI which allows us to graphically
  interact with the API
- **@staticdeploy/cli** is a command line tool which we can use to create and
  deploy bundles
- the **static server** is the component responsible for serving deployed
  assets. Clients of this service are the users which request - optionally via a
  CDN - the deployed websites
- the **storage layer** is where StaticDeploy saves its entities. Currently the
  only supported non-volatile storage layer uses
  [PostgreSQL](https://www.postgresql.org/) and
  [Amazon S3](https://aws.amazon.com/s3/) (or API-compatible servers like
  [Minio](https://minio.io))
