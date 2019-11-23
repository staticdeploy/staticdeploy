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

- `root`: allows performing all operations
- `app-manager:name-matcher`: for an app whose `name` matches the _name matcher_
  (see below for info), allows performing the following operations:
  - updating the app
  - deleting the app
  - creating entrypoints linked to the app (provided the necessary
    `entrypoint-manager` role)
- `bundle-manager:name-matcher`: for a bundle whose `name` matches the _name
  matcher_ (see below for info), allows performing the following operations:
  - creating the bundle
  - deleting the bundle
- `entrypoint-manager:urlMatcher-matcher`: for an entrypoint whose `urlMatcher`
  matches the _url matcher matcher_ (see below for info), allows performing the
  following operations:
  - creating the entrypoint (provided the necessary `app-manager` role for the
    app it links to)
  - updating the entrypoint
  - deleting the entrypoint

### Role targets

#### Name matcher

For the `app-manager` and `bundle-manager` roles, the target _name matcher_ is a
pattern matching many names. For example:

- the pattern `*` matches any name
- the pattern `name` only matches `name`
- the pattern `*name` matches `name` and `prefix-name`
- the pattern `name*` matches `name` and `name-suffix`

#### Url matcher matcher

For the `entrypoint-manager` role, the target _url matcher matcher_ is a pattern
matching many url matchers . For example:

- the pattern `*/` matches any url matcher
- the pattern `example.com/` matches url matchers:
  - `example.com/`
  - `example.com/foo/`
  - `example.com/foo/bar/`
  - etc
- the pattern `example.com/foo/` matches url matchers:
  - `example.com/foo/`
  - `example.com/foo/bar/`
  - etc
- the pattern `*.example.com/` matches url matchers:
  - `foo.example.com/`
  - `foo.example.com/foo/`
  - `foo.bar.example.com/`
  - etc
- the pattern `*example.com/` matcher url matchers:
  - `example.com/`
  - `example.com/foo/`
  - `foo.example.com/`
  - `fooexample.com/` (not a subdomain of example.com)
  - etc
