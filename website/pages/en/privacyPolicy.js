const React = require("react");
const { Remarkable } = require("remarkable");

const { Container } = require("../../core/CompLibrary.js");

const htmlContent = new Remarkable().render(`
# Privacy policy for staticdeploy.io

When you visit [staticdeploy.io](https://staticdeploy.io) the only personal
information collected by the website is the one automatically sent by your
browser when requesting web pages. This information includes things like your IP
address and your browser's user agent, which are collected in the form of server
logs.

Server logs are analyzed for two purposes:

- monitoring the website and ensuring it stays operational
- deriving traffic statistics (how many visitors per day, which pages are
  requested the most, where do visitors come from, etc)

Server logs are only accessible to this website's administrators and to
[Amazon Web Services (AWS)](https://aws.amazon.com/), this website's cloud
provider.

All server logs are stored on servers located within the EU territory.

Information stored in server logs **can not** be used to identify any of its
visitors.

This website **does not** use any browser cookies for any purpose.

Should you have any question about this privacy policy or about the way we
handle data, feel free to send an email to
[privacy@staticdeploy.io](mailto:privacy@staticdeploy.io).
`);

module.exports = () => (
    <div className="pageContainer">
        <Container className="mainContainer documentContainer postContainer">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Container>
    </div>
);
