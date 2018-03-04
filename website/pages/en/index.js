const React = require("react");

const Index = () => (
    <div>
        <p>
            {"Staticdeploy is an open source platform for deploying and"}
            {"configuring static web applications. Think about it as "}
            <a
                href="https://kubernetes.io/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {"kubernetes"}
            </a>
            {", but for static apps."}
        </p>
    </div>
);
module.exports = Index;
