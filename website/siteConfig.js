module.exports = {
    title: "StaticDeploy",
    tagline: "Deploy and Configure Static Apps with Ease",
    url: "https://staticdeploy.io",
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    projectName: "staticdeploy",
    customDocsPath: "website/docs",
    headerLinks: [
        { label: "Docs", doc: "getting-started.overview" },
        {
            label: "GitHub",
            href: "https://github.com/staticdeploy/staticdeploy"
        }
    ],
    headerIcon: "images/logo.png",
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
