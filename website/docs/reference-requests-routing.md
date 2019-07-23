---
id: reference-requests-routing
title: How StaticDeploy routes requests
---

## Matching requests to entrypoints

A StaticDeploy installation can host thousands of websites, each deployed on a
different [entrypoint](/docs/reference-entities#entrypoints). The first thing
StaticDeploy does upon receiving a request is to figure out which entrypoint is
targeted by the request.

Every entrypoint specifies a `urlMatcher`, a domain + path combination which is
used to match incoming requests. A request matches a url matcher (and its
entrypoint) if its domain + path **starts with** the url matcher. For instance,
a request for `domain.com/foo/bar/baz` would match all of the following url
matchers:

- `domain.com/`
- `domain.com/foo/`
- `domain.com/foo/bar/`
- `domain.com/foo/bar/baz/`

It would not however match:

- `www.domain.com/`
- `domain.com/foo/baz/`

When more than one entrypoint matches the incoming request, StaticDeploy chooses
the one with the longest url matcher, using the principle of choosing the "most
specific" one.

When no entrypoint matches the incoming request, StaticDeploy responds with a
404 page.

Once an entrypoint for the incoming request has been found, StaticDeploy
constructs the response according to the entrypoint's configuration:

- if the entrypoint specifies a `redirectTo`, StaticDeploy responds with a 302
  to the specified location
- if the entrypoint specifies a `bundleId`, StaticDeploy matches the requested
  path to one of the assets of the entrypoint's bundle (read below how), and
  serves the asset

In the second case, before performing the _requested path / asset_ match,
StaticDeploy removes the path portion of the entrypoint's `urlMatcher` from the
requested path, since it's just the base path at which the entryppoint's bundle
is hosted, and the bundle's assets "know nothing" about it.

> **A note on the domain**
>
> An HTTP request contains the requested path in its start-line. The domain of
> the request can be usually found in the `Host` header, but that's not always
> the case, as proxies (eg CDNs) sitting between the user and the StaticDeploy
> server might modify it. When such modifications occur, proxies usually add the
> `X-Forwarded-Host` header to the proxied request, passing the original value
> of the `Host` header. If the header is present, StaticDeploy automatically
> uses its value. However, not all proxies adopt this behavior, and might
> instead pass the original value in another custom header. To account for this
> use case, you can configure StaticDeploy to use the custom header by passing
> it the `HOSTNAME_HEADER` configuration variable. Proxies that don't allow to
> pass the original `Host` header value in any way cannot unfortunately be used
> with StaticDeploy.

## Serving assets

One of the main use cases for StaticDeploy is serving Single Page Applications
(SPA). StaticDeploy's routing algorithm was designed to solve the problems that
arise when SPAs do client-side routing using the
[HTML5 history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API),
i.e. when they change their path in the browser URL.

When StaticDeploy receives a request for a certain path, it tries to match the
path to one of the assets of the bundle it's tasked to serve, even if the
requested path is not strictly equal to the asset path. If it can't match the
path to any asset, it serves the asset designated to be the fallback asset
(typically `/index.html`). We'll explain the routing algorithm with an example.

### Example

Let's assume StaticDeploy is serving a bundle with the assets:

```sh
/
├── index.html
└── js/
    └── index.js
```

#### Falling back to a "catch all" asset

When a request is made for `/` or for `/index.html`, naturally StaticDeploy
responds with the `/index.html` file. When a request is made instead for
`/some/path/`, StaticDeploy tries to match it to one of the files in the
directory. `/some/path/` doesn't look anything like `/index.html` or
`/js/index.js`, so StaticDeploy determines that no file matches the requested
path, and serves the fallback asset, which happens to be `/index.html`.

This behaviour solves the problem of a user reloading a Single Page Application
when the browser URL has been modified by client-side routing: instead of
getting a 404 because the reloaded URL is not `/`, the browser receives the
`index.html` and the app can restart without issues.

#### Serving files with a "similar" path

When a request is made for `/js/index.js`, naturally StaticDeploy responds with
the `/js/index.js` file. But when a request is made for
`/some/path/js/index.js`, instead of responding with a 404 or with the fallback
asset, StaticDeploy sees that the requested path _looks a lot like_
`/js/index.js`, assumes that the requester wanted that file, and responds with a
301, redirecting to the file's _canonical path_, i.e. `/js/index.js`.

This behaviour saves the developer of the app from having to statically specify
(in the code or at build time) the **exact** paths of the app's assets. In the
example above, in the `index.html` file the developer can just point to the
`index.js` file with a relative URL: `./js/index.js`. Now even when
`/index.html` is loaded - as a fallback - from `/some/path/`, `./js/index.js`
will be resolved by the browser to `/some/path/js/index.js`, which leads to the
correct file.

This is especially useful when the app is deployed to an entrypoint "with a base
path", e.g. `example.com/base-path/`. In this case, if the developer had to
statically specify the **exact** paths, they'd have to know beforehand (or at
most at build time) what the base path of the deployed app would be, an
information they might not have or that might change over time, requiring the
app to be rebuilt.
