import Button from "antd/lib/button";
import React from "react";

interface IProps {
    onLogin: () => any;
    strategyDisplayName: string;
}
export default class OidcLogin extends React.Component<IProps> {
    static defaultProps = {
        providerName: "external provider"
    };
    render() {
        const { strategyDisplayName, onLogin } = this.props;
        return (
            <div>
                <Button
                    className="c-LoginMask-login-button"
                    onClick={() => onLogin()}
                >
                    {`Login with ${strategyDisplayName}`}
                </Button>
            </div>
        );
    }
}
