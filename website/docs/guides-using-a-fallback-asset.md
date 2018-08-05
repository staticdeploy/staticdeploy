---
id: guides-using-a-fallback-asset
title: Using a fallback asset
---

As explained in the
[request routing reference article](/docs/reference-request-routing), when
StaticDeploy receives a request to a certain entrypoint that doesn't match any
asset in the entrypoint's bundle, the bundle's fallback asset is served instead.

A bundle's fallback asset is specified when creating the bundle, using the
`--fallbackAssetPath` option of the StaticDeploy **cli** `bundle` command. The
value of the option must be the absolute path - relative to the bundled
directory - of one of the bundle's assets. The default value is `/index.html`,
which assumes the existence of an `/index.html` asset.

It's also possible to specify the HTTP status code that StaticDeploy uses when
serving the fallback asset by setting the `--fallbackStatusCode` option (the
default value is `200`).

When serving Single Page Applications with StaticDeploy, the defaults are
probably correct: `/index.html` is served with a `200` status code, making the
browser load the SPA which then _highjacks_ the browser URL to do client side
routing.

When serving static websites instead, we might want the fallback asset to be a
404 page, for instance `/404.html`, and we want it to be served with a `404`
status code, to comply with SEO best practices.
