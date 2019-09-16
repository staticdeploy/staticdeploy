import Card from "antd/lib/card";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import compact from "lodash/compact";
import React from "react";

import AuthService, { IStatus } from "../../common/AuthService";
import intersperseNodes from "../../common/intersperseNodes";
import ErrorAlert from "../ErrorAlert";
import Logo from "../Logo";
import "./index.css";
import JwtLogin from "./JwtLogin";
import OidcLogin from "./OidcLogin";
import UserCreationInstructions from "./UserCreationInstructions";

interface IProps {
    authService: AuthService;
}

export default class LoginMask extends React.Component<IProps> {
    boundForceUpdate = () => this.forceUpdate();
    componentDidMount() {
        this.props.authService.onStatusChange(this.boundForceUpdate);
    }
    componentWillUnmount() {
        this.props.authService.offStatusChange(this.boundForceUpdate);
    }
    renderError(error: Error) {
        return <ErrorAlert message={error.message} />;
    }
    renderRequiresUserCreationError(requiresUserCreationError: Error) {
        return (
            <UserCreationInstructions
                requiresUserCreationError={requiresUserCreationError}
            />
        );
    }
    renderLogins() {
        const { authService } = this.props;
        return intersperseNodes(
            compact([
                authService.hasAuthStrategy("oidc") ? (
                    <OidcLogin
                        key="oidc"
                        onLogin={() => authService.loginWith("oidc")}
                        strategyDisplayName={authService.getStrategyDisplayName(
                            "oidc"
                        )}
                    />
                ) : null,
                authService.hasAuthStrategy("jwt") ? (
                    <JwtLogin
                        key="jwt"
                        onLogin={jwt => authService.loginWith("jwt", jwt)}
                        strategyDisplayName={authService.getStrategyDisplayName(
                            "jwt"
                        )}
                    />
                ) : null
            ]),
            <Divider>{"or"}</Divider>
        );
    }
    renderLoginMask(authStatus: IStatus) {
        const content = authStatus.loginError
            ? this.renderError(authStatus.loginError!)
            : authStatus.requiresUserCreation
            ? this.renderRequiresUserCreationError(
                  authStatus.requiresUserCreationError!
              )
            : this.renderLogins();
        return (
            <div className="c-LoginMask">
                <Card className="c-LoginMask-card">
                    <div className="c-LoginMask-card-header">
                        <Logo withShadow={true} />
                        <h3 className="c-LoginMask-card-title">
                            {"StaticDeploy"}
                            <br />
                            {"Management Console"}
                        </h3>
                    </div>
                    <Spin
                        indicator={<Icon type="loading" spin={true} />}
                        spinning={authStatus.isLoggingIn}
                    >
                        {content}
                    </Spin>
                </Card>
            </div>
        );
    }
    render() {
        const { authService } = this.props;
        const authStatus = authService.getStatus();
        return !authService.authEnforced ||
            (authStatus.isLoggedIn && !authStatus.requiresUserCreation)
            ? this.props.children
            : this.renderLoginMask(authStatus);
    }
}
