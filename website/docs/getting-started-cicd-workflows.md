---
id: getting-started-cicd-workflows
title: CI/CD Workflow
---

StaticDeploy allows for a variety of workflows for continuous delivery and
deployment of a static app.

To implement them, first of all you should set up your CI server to build the
app and create a bundle for the build on each commit. You can choose to tag the
bundle with the name of the branch your commit was added to, or even with the
sha of the commit. For instance, for a [react app](https://create-react-app.dev)
in your CI server you could do something like:

```sh
# Build the app, saving static artifacts into the build/ folder
npm run build
# Create a bundle from that folder
staticdeploy bundle
  --from build/
  --name example-app
  --tag $BRANCH
  --description "Build of commit $COMMIT"
```

Then, you could choose to:

- automatically deploy each branch to `$BRANCH.example-app.com/`:

  ```sh
  staticdeploy deploy
    --app example-app
    --entrypoint $BRANCH.example-app.com/
    --bundle example-app:$BRANCH
  ```

- automatically deploy git tags to `example-app.com/$TAG/` (can be useful for
  versioning documentation websites):

  ```sh
  staticdeploy deploy
    --app example-app
    --entrypoint example-app.com/$TAG/
    --bundle example-app:$TAG
  ```

- automatically deploy `master` to the production environment:

  ```sh
  staticdeploy deploy
    --app example-app
    --entrypoint example-app.com/
    --bundle example-app:master
  ```

- manually deploy to production using StaticDeploy's Management Console
