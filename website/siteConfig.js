module.exports = {
    title: "staticdeploy",
    tagline: "Deploy and configure your static apps with ease",
    url: "https://staticdeploy.io",
    baseUrl: "/",
    projectName: "staticdeploy",
    customDocsPath: "website/docs",
    headerLinks: [
        { label: "Docs", doc: "quickstart.setting-up-with-docker-compose" },
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
    stylesheets: ["css/custom.css"],
    copyright: `Copyright © ${new Date().getFullYear()} Paolo Scanferla`,
    highlight: {
        theme: "default"
    }
};
