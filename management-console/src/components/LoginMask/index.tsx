import Alert from "antd/es/alert";
import Spin from "antd/es/spin";
import React from "react";

import IAuthTokenService, { IStatus } from "../../common/IAuthTokenService";
import "./index.css";
import LoginForm from "./LoginForm";

interface IProps {
    authTokenService: IAuthTokenService;
}

export default class LoginMask extends React.Component<IProps> {
    boundForceUpdate = () => this.forceUpdate();
    componentWillMount() {
        this.props.authTokenService.onStatusChange(this.boundForceUpdate);
    }
    componentWillUnmount() {
        this.props.authTokenService.offStatusChange(this.boundForceUpdate);
    }
    renderLoginMask() {
        return (
            <div className="c-LoginMask">
                <div className="c-LoginMask-container">
                    <LoginForm
                        onSubmit={({ authToken }) => {
                            this.props.authTokenService.setAuthToken(authToken);
                        }}
                    />
                </div>
            </div>
        );
    }
    renderSpinner() {
        return (
            <div className="c-LoginMask">
                <Spin size="large" tip="Logging in" />
            </div>
        );
    }
    renderError(authTokenStatus: IStatus) {
        return (
            <div className="c-LoginMask">
                <div className="c-LoginMask-container">
                    <Alert
                        type="error"
                        message="Error logging in"
                        description={authTokenStatus.retrievingError!.message}
                        showIcon={true}
                    />
                </div>
            </div>
        );
    }
    render() {
        const authTokenStatus = this.props.authTokenService.getStatus();
        return authTokenStatus.isSet
            ? this.props.children
            : authTokenStatus.isRetrieving
            ? this.renderSpinner()
            : authTokenStatus.retrievingError
            ? this.renderError(authTokenStatus)
            : this.renderLoginMask();
    }
}
