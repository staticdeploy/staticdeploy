const { join } = require("path");

const BUNDLE_TAG = process.env.CIRCLE_TAG || process.env.CIRCLE_BRANCH;
const IS_MASTER = BUNDLE_TAG === "master";

module.exports = {
    bundle: {
        from: join(__dirname, "/build/staticdeploy"),
        name: "staticdeploy.io",
        tag: BUNDLE_TAG,
        description: `Commit ${process.env.CIRCLE_SHA1}`,
        fallbackAssetPath: "/notFound.html",
        fallbackStatusCode: 404
        // TODO: re-enable after v0.9.1
        // headers: {
        //     "**/*": {
        //         "Cache-Control": "public, max-age=86400"
        //     }
        // }
    },
    deploy: {
        app: "staticdeploy.io",
        entrypoint: IS_MASTER
            ? "staticdeploy.io/"
            : `staticdeploy.io/_/${BUNDLE_TAG}/`,
        bundle: `staticdeploy.io:${BUNDLE_TAG}`
    }
};
