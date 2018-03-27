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
        primaryColor: "#2E8555",
        secondaryColor: "#205C3B"
    },
    copyright: `Copyright © ${new Date().getFullYear()} Paolo Scanferla`,
    highlight: {
        theme: "default"
    }
};
