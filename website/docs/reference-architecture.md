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

- the **Management API** is a RESTful API to manage StaticDeploy's entities like
  bundles and entrypoints
- the **Management Console** is a web GUI which allows you to graphically
  interact with the API
- the **StaticDeploy CLI** is a command line tool which you can use to create
  and deploy bundles
- the **Static Server** is the component responsible for serving deployed
  assets. Clients of this service are the users which request - optionally via a
  CDN - the deployed websites
- the **storage layer** is where StaticDeploy saves its entities. Currently the
  only supported non-volatile storage layer uses
  [PostgreSQL](https://www.postgresql.org/) and
  [Amazon S3](https://aws.amazon.com/s3/) (or API-compatible servers like
  [Minio](https://minio.io))
