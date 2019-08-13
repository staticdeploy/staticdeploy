import { AuthEnforcementLevel } from "@staticdeploy/core";
import Card from "antd/lib/card";
import Divider from "antd/lib/divider";
import Spin from "antd/lib/spin";
import compact from "lodash/compact";
import React from "react";

import AuthService, { IStatus } from "../../common/authService/AuthService";
import intersperseNodes from "../../common/intersperseNodes";
import ErrorAlert from "../ErrorAlert";
import Logo from "../Logo";
import "./index.css";
import JwtLogin from "./JwtLogin";
import OidcLogin from "./OidcLogin";

interface IProps {
    authService: AuthService;
    oidcProviderName?: string;
}

export default class LoginMask extends React.Component<IProps> {
    boundForceUpdate = () => this.forceUpdate();
    componentWillMount() {
        this.props.authService.onStatusChange(this.boundForceUpdate);
    }
    componentWillUnmount() {
        this.props.authService.offStatusChange(this.boundForceUpdate);
    }
    renderSpinner() {
        return (
            <div className="c-LoginMask-spinner">
                <Spin size="large" tip="Logging in" />
            </div>
        );
    }
    renderError(error: Error) {
        return <ErrorAlert message={error.message} />;
    }
    renderLogins() {
        const { authService, oidcProviderName } = this.props;
        return intersperseNodes(
            compact([
                authService.hasAuthStrategy("oidc") ? (
                    <OidcLogin
                        key="oidc"
                        onLogin={() => authService.loginWith("oidc")}
                        providerName={oidcProviderName}
                    />
                ) : null,
                authService.hasAuthStrategy("jwt") ? (
                    <JwtLogin
                        key="jwt"
                        onLogin={jwt => authService.loginWith("jwt", jwt)}
                    />
                ) : null
            ]),
            <Divider>{"or"}</Divider>
        );
    }
    renderLoginMask(authStatus: IStatus) {
        const content = authStatus.isLoggingIn
            ? this.renderSpinner()
            : authStatus.loginError
            ? this.renderError(authStatus.loginError!)
            : this.renderLogins();
        return (
            <div className="c-LoginMask">
                <Card className="c-LoginMask-card">
                    <div className="c-LoginMask-card-header">
                        <Logo color="blue" />
                        <h3 className="c-LoginMask-card-title">
                            {"StaticDeploy"}
                            <br />
                            {"Management Console"}
                        </h3>
                    </div>
                    {content}
                </Card>
            </div>
        );
    }
    render() {
        const authEnforcementLevel = this.props.authService.getAuthEnforcementLevel();
        const authStatus = this.props.authService.getStatus();
        return authEnforcementLevel === AuthEnforcementLevel.None ||
            authStatus.authToken
            ? this.props.children
            : this.renderLoginMask(authStatus);
    }
}
