---
id: guides-using-a-client-side-router
title: Using a client-side router
---

If your Single Page Applications use a client-side router that relies on the
[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API),
and are deployed at a non-root path, you most likely need to tell the router the
base path _from which to start routing_.

Example: if your app is deployed at `example.com/foo/`, you need to tell the
router to consider `/foo/` the root from which to start routing, so that - in
the app - navigating to `/bar/` actually brings you to `example.com/foo/bar/`
instead of `example.com/bar/` (which is most likely the desired behavior).

To avoid having to specify this at build-time, you can add a configuration
variable (e.g. `BASE_PATH`) to the entrypoint at which you're deploying your
app, and pass it at runtime to your router.

### Examples for popular client-side routers

##### React Router ([docs ⬈](https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string))

```jsx
<BrowserRouter basename={window.APP_CONFIG.BASE_PATH}>
```

##### Vue Router ([docs ⬈](https://router.vuejs.org/api/#base))

```js
new VueRouter({
  mode: "history",
  base: window.APP_CONFIG.BASE_PATH
});
```

##### Angular Router ([docs ⬈](https://angular.io/api/common/APP_BASE_HREF))

```ts
import { Component, NgModule } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";

@NgModule({
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: window.APP_CONFIG.BASE_PATH
    }
  ]
})
class AppModule {}
```
