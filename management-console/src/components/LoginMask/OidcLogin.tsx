import Button from "antd/lib/button";
import React from "react";

interface IProps {
    providerName?: string;
    onLogin: () => any;
}
export default class OidcLogin extends React.Component<IProps> {
    static defaultProps = {
        providerName: "external provider"
    };
    render() {
        const { providerName, onLogin } = this.props;
        return (
            <div>
                <h4>{`Login with ${providerName}`}</h4>
                <Button
                    className="c-LoginMask-login-button"
                    onClick={() => onLogin()}
                >
                    {"Login"}
                </Button>
            </div>
        );
    }
}
