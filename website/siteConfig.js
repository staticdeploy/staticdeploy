module.exports = {
    title: "StaticDeploy",
    tagline: "An Open-Source Platform for Deploying Static Apps",
    url: "https://staticdeploy.io",
    // When building for production, use relative urls, which will be correctly
    // handled by StaticDeploy. Use the BUILD_FOR_PRODUCTION instead of the
    // NODE_ENV === "production" check because when building the website with
    // NODE_ENV set to production docusaurus (1.2.1) doesn't honor the cleanUrl
    // option. TODO: file an issue on facebook/docusaurus
    baseUrl: process.env.BUILD_FOR_PRODUCTION === "true" ? "./" : "/",
    cleanUrl: true,
    projectName: "staticdeploy",
    customDocsPath: "website/docs",
    headerLinks: [
        { label: "Docs", doc: "getting-started-overview" },
        {
            label: "GitHub",
            href: "https://github.com/staticdeploy/staticdeploy"
        }
    ],
    headerIcon: "images/top-bar-logo.png",
    favicon: "images/favicon.png",
    colors: {
        primaryColor: "#4a90e2",
        secondaryColor: "#33639d"
    },
    copyright: `Copyright © ${new Date().getFullYear()} Paolo Scanferla`,
    highlight: {
        theme: "default"
    },
    gaTrackingId: "UA-119541902-1",
    gaGtag: true
};
