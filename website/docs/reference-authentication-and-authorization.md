---
id: reference-authentication-and-authorization
title: Authentication and authorization
---

> Note: authentication and authorization can be switched off by setting to
> `false` the `ENFORCE_AUTH` configuration parameter. This is generally not
> advised, but can be useful in scenarios where network perimeter security is
> deemed enough.

## Authentication

<div class="paddedDocsImage">
  <img
    src="../images/authentication-flow.svg"
    alt="StaticDeploy Authentication Flow"
  />
</div>

Before calling the StaticDeploy Management API, a user needs to get an
authentication token that certifies their identity. StaticDeploy is not an
identity provider (IdP), so an external IdP is needed to issue such tokens, that
StaticDeploy is then able to verify.

Currently two types of identity providers are supported:

- **OpenID Connect IdPs**, such as Azure Active Directory or GitHub, that issue
  JWT `id_token`-s. Users can obtain such tokens via the StaticDeploy Management
  Console, by simply clicking on the _Login with external provider_ button.
  StaticDeploy is able to validate these tokens by verifying their cryptographic
  signature with the public key of the IdP (for details, see the
  [guide to configure StaticDeploy to use an OpenID Connect provider](/docs/guides-openid-connect-providers))

- **IdPs that issue JWTs _in some other way_**. Users have to manually obtain
  such tokens, which they can then use with the StaticDeploy Management Console,
  or with the StaticDeploy CLI. To enable StaticDeploy to validate these tokens,
  it must be configured with the private or public key used to sign the tokens
  (for details, see the
  [guide to configure StaticDeploy to use JWT-issuing providers](/docs/guides-jwt-providers))

## Authorization

<div class="paddedDocsImage">
  <img
    src="../images/authorization-flow.svg"
    alt="StaticDeploy Authorization Flow"
  />
</div>

Once the user has an authentication token, they can call the Management API. The
authentication token contains two key pieces of information:

- the name of the identity provider that issued the token
- the user id for the identity provider

StaticDeploy uses these two parameters to find the _user object_ corresponding
to the user. The user object contains some StaticDeploy-specific information
about the user, such as the groups the user belongs to. Groups are collections
of roles, simple strings that allow performing certain operations (see below for
details). The user groups, and therefore roles, are then used by the authorizer
to determine wether the user is allowed or not to perform the operation for
which they have called the Management API.

## Roles

StaticDeploy authorizes operations using the following roles:

- `root`: allows performing all operations
- `reader`: allows performing all read operations (currently there are no
  finer-grained roles for read access)
- `app-manager:id`: allows performing the following operations on the app with
  the specified id:
  - updating the app
  - deleting the app
  - creating entrypoints linked to the app (provided the necessary
    `entrypoint-manager` role)
- `entrypoint-manager:urlMatcher`: allows performing the following operations on
  the entrypoint with the specified url matcher:
  - creating the entrypoint (provided the necessary `app-manager` role for the
    app the entrypoint is linked to)
  - updating the entrypoint
  - deleting the entrypoint
- `bundle-manager:name`: allows performing the following operations on bundles
  with the specified name:
  - creating a bundle
  - deleting a bundle

> Note on the `entrypoint-manager` role: the target `urlMatcher` is actually a
> pattern matching many url matchers (a url-matcher matcher). For example:
>
> - the pattern `example.com/` allows managing entrypoints with url matcher:
>   - `example.com/`
>   - `example.com/foo/`
>   - `example.com/foo/bar/`
>   - etc
> - the pattern `example.com/foo/` allows managing entrypoints with url matcher:
>   - `example.com/foo/`
>   - `example.com/foo/bar/`
>   - etc
> - the pattern `*.example.com/` allows managing entrypoints with url matcher:
>   - `foo.example.com/`
>   - `foo.example.com/foo/`
>   - `foo.bar.example.com/`
>   - etc
> - the pattern `*example.com/` allows managing entrypoitns with utl matchers:
>   - `example.com/`
>   - `example.com/foo/`
>   - `foo.example.com/`
>   - `fooexample.com/` (not a subdomain of example.com)
>   - etc
