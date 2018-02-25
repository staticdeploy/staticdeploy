import Icon from "antd/lib/icon";
import Tooltip from "antd/lib/tooltip";
import * as React from "react";

import IAuthTokenService from "../../common/IAuthTokenService";
import "./index.css";

interface IProps {
    authTokenService: IAuthTokenService;
}

export default class LogoutButton extends React.PureComponent<IProps> {
    render() {
        return (
            <Tooltip title="Logout" placement="right">
                <div
                    className="c-LogoutButton"
                    onClick={() =>
                        this.props.authTokenService.setAuthToken(null)
                    }
                >
                    <Icon type="logout" />
                </div>
            </Tooltip>
        );
    }
}
