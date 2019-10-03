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
                        src={withBaseUrl("/images/logo.svg")}
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

const MainFeatures = () => (
    <Container className="mainFeatures" padding={["bottom", "top"]}>
        <GridBlock
            align="center"
            className="firstRow"
            contents={[
                {
                    image: withBaseUrl("/images/home.workflow.svg"),
                    imageAlign: "top",
                    title: "Docker-like Workflow",
                    content: stripIndent(`
                        A proven workflow for building, distributing, and
                        deploying your apps
                    `)
                },
                {
                    image: withBaseUrl("/images/home.previews.svg"),
                    imageAlign: "top",
                    title: "Instant Previews",
                    content: stripIndent(`
                        Deploy every commit and show people what you're working
                        on
                    `)
                },
                {
                    image: withBaseUrl("/images/home.dashboard.svg"),
                    imageAlign: "top",
                    title: "Management Console",
                    content: stripIndent(`
                        A single place to view and manage all of your company
                        apps
                    `)
                }
            ]}
            layout="threeColumn"
        />
        <GridBlock
            align="center"
            className="secondRow"
            contents={[
                {
                    image: withBaseUrl("/images/home.configuration.svg"),
                    imageAlign: "top",
                    title: "Runtime Configuration",
                    content: stripIndent(`
                        Re-build to re-deploy be gone! Promote to prod exactly
                        what you were testing
                    `)
                },
                {
                    image: withBaseUrl("/images/home.opensource.svg"),
                    imageAlign: "top",
                    title: "Open Source",
                    content: stripIndent(`
                        Host it where you want it, how you want it, with no
                        proprietary lock-in
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
            <MainFeatures />
        </div>
    </div>
);
