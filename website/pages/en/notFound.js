const React = require("react");

const Button = (props) => (
    <div className="pluginWrapper buttonWrapper">
        <a
            className="button"
            href={props.href}
            target={props.target}
            style={{ width: "200px" }}
        >
            {props.children}
        </a>
    </div>
);

module.exports = () => (
    <div className="homeContainer notFoundPage">
        <div className="homeSplashFade">
            <div className="wrapper homeWrapper">
                <div className="inner">
                    <div className="projectTitle">
                        <h1 className="fourOhFour">{"404"}</h1>
                        <br />
                        <h1 className="fourOhFourMessage">
                            {"Page not found"}
                        </h1>
                    </div>
                    <div className="section promoSection">
                        <div className="promoRow">
                            <div className="pluginRowBlock">
                                <Button href="https://staticdeploy.io">
                                    {"Back to the homepage"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
