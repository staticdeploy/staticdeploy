const React = require("react");
const stripIndent = require("strip-indent");

// The following file is injected by docusaurus during the build, see
// https://docusaurus.io/docs/en/api-pages.html#page-require-paths for details
const { Container, GridBlock } = require("../../core/CompLibrary.js");
const withBaseUrl = require(`${process.cwd()}/core/withBaseUrl.js`);
const siteConfig = require(`${process.cwd()}/siteConfig.js`);

const Button = props => (
    <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
            {props.children}
        </a>
    </div>
);

const HomeSplash = () => (
    <div className="homeContainer">
        <div className="homeSplashFade">
            <div className="wrapper homeWrapper">
                <div className="inner">
                    <img
                        className="staticdeployLogo"
                        src="/images/logo-white.png"
                        width="100px"
                    />
                    <h2 className="projectTitle">
                        <span className="staticdeployTitle">
                            <span>Static</span>
                            <span>Deploy</span>
                        </span>
                        <small>{siteConfig.tagline}</small>
                    </h2>
                    <div className="section promoSection">
                        <div className="promoRow">
                            <code>
                                {"docker run staticdeploy/staticdeploy"}
                            </code>
                            <Button
                                href={withBaseUrl(
                                    "/docs/getting-started-quickstart"
                                )}
                            >
                                {"get started"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MainFeaturesRow = () => (
    <Container padding={["bottom", "top"]}>
        <GridBlock
            align="center"
            contents={[
                {
                    image: withBaseUrl("/images/home.deployments.svg"),
                    imageAlign: "top",
                    title: "Flexible Deployments",
                    content: stripIndent(`
                        Show people what you're working on! Deploy every branch,
                        tag, or even commit of your app, using the url scheme
                        that best fits your needs
                    `)
                },
                {
                    image: withBaseUrl("/images/home.configuration.svg"),
                    imageAlign: "top",
                    title: "Runtime Configuration",
                    content: stripIndent(`
                        Configuration at build time be gone! Define your app's
                        configuration in the StaticDeploy console, and have it
                        injected into your bundles at runtime
                    `)
                },
                {
                    image: withBaseUrl("/images/home.routing.svg"),
                    imageAlign: "top",
                    title: "Smart Routing",
                    content: stripIndent(`
                        Was it **/static** or **./static**? Or should I add the
                        base url? Don't worry, StaticDeploy's smart routing
                        algorithm will find your content
                    `)
                }
            ]}
            layout="threeColumn"
        />
    </Container>
);

module.exports = () => (
    <div className="homePage">
        <HomeSplash />
        <div className="mainContainer">
            <MainFeaturesRow />
        </div>
    </div>
);
