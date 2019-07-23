import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import * as React from "react";
import { Link } from "react-router-dom";

// Not a PureComponent since we want it to re-render on location change
export default class SiderNav extends React.Component {
    render() {
        const firstLevelPath = window.location.pathname
            .split("/")
            .slice(0, 2)
            .join("/");
        return (
            <Menu
                className="c-SiderNav"
                theme="dark"
                selectedKeys={[firstLevelPath]}
            >
                <Menu.Item key="/apps">
                    <Link to="/apps">
                        <Icon type="global" />
                        <span>{"Apps and entrypoints"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/bundles">
                    <Link to="/bundles">
                        <Icon type="folder" />
                        <span>{"Bundles"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/operationLogs">
                    <Link to="/operationLogs">
                        <Icon type="profile" />
                        <span>{"Operation logs"}</span>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}
