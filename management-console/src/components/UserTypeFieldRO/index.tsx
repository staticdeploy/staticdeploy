import { UserType } from "@staticdeploy/core";
import Icon from "antd/lib/icon";
import upperFirst from "lodash/upperFirst";
import React from "react";

import "./index.css";

interface IProps {
    title: React.ReactNode;
    userType: UserType;
}

export default class UserTypeFieldRO extends React.Component<IProps> {
    render() {
        const { title, userType } = this.props;
        return (
            <div className="c-UserTypeFieldRO">
                <h4>{title}</h4>
                <Icon type={userType === UserType.Human ? "user" : "robot"} />
                <span className="c-UserTypeFieldRO-type">
                    {upperFirst(userType)}
                </span>
            </div>
        );
    }
}
