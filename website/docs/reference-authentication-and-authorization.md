---
id: reference-authentication-and-authorization
title: Authentication and authorization
---

> **Note**: authentication and authorization can be switched off by setting to
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

Currently StaticDeploy ships with two strategies for verifying tokens, that
enable support for two types of identity providers:

- **OpenID Connect IdPs** - such as Azure Active Directory or Google - that
  issue Json Web Tokens (JWTs) using the OpenID Connect protocol. These tokens
  are verified by StaticDeploy with its OpenID Connect strategy. Users can
  obtain such tokens via the StaticDeploy Management Console, simply by clicking
  on the _Login with \${provider}_ button
- **IdPs that issue JWTs _in some other way_**. These tokens are verified by
  StaticDeploy with its JWT strategy. Users have to manually obtain such tokens,
  which they can then use with the StaticDeploy Management Console, or with the
  StaticDeploy CLI

## Authorization

<div class="paddedDocsImage">
  <img
    src="../images/authorization-flow.svg"
    alt="StaticDeploy Authorization Flow"
  />
</div>

Once the user has an authentication token, they can call the Management API
(using the Management Console or the CLI). The authentication token contains two
key pieces of information:

- `idp`: the name of the identity provider that issued the token
- `idpId`: the user id for the identity provider

StaticDeploy uses these two parameters to find the _user object_ corresponding
to the user.

The user object contains some StaticDeploy-specific information about the user,
such as the groups the user belongs to. Groups are collections of roles, simple
strings that allow performing certain operations (see below for details). The
user groups, and therefore roles, are then used by the authorizer to determine
whether the user is allowed or not to perform the operation for which they have
called the Management API.

> **Note**: if no corresponding user object is found, the user is denied access.
> Therefore, before a user can perform any operation, the corresponding user
> object must be created by an admin

## Roles

Every user that has access to StaticDeploy can perform read operations on all
resources. For authorizing write operations, the following roles are used:

- `root`: allows performing all operations finer-grained roles for read access)
- `app-manager:name`: allows performing the following operations on the app with
  the specified name:
  - updating the app
  - deleting the app
  - creating entrypoints linked to the app (provided the necessary
    `entrypoint-manager` role)
- `entrypoint-manager:urlMatcher`: allows performing the following operations on
  the entrypoint with the specified url matcher:
  - creating the entrypoint (provided the necessary `app-manager` role for the
    app the entrypoint links to)
  - updating the entrypoint
  - deleting the entrypoint
- `bundle-manager:name`: allows performing the following operations on bundles
  with the specified name:
  - creating a bundle
  - deleting a bundle

> **Note on the `entrypoint-manager` role**: the target `urlMatcher` is actually
> a pattern matching many url matchers (a url-matcher matcher). For example:
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
> - the pattern `*example.com/` allows managing entrypoints with utl matchers:
>   - `example.com/`
>   - `example.com/foo/`
>   - `foo.example.com/`
>   - `fooexample.com/` (not a subdomain of example.com)
>   - etc
