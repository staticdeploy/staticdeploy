import React from "react";

import TextFieldRO from "../../TextFieldRO";
import extractIdpInfo from "./extractIdpInfo";
import "./index.css";

interface IProps {
    requiresUserCreationError: Error;
}
export default class UserCreationInstructions extends React.Component<IProps> {
    render() {
        const idpInfo = extractIdpInfo(
            this.props.requiresUserCreationError.message
        );
        return (
            <>
                <div className="c-UserCreationInstructions-description">
                    <h2>{"Registration Required"}</h2>
                    <p>
                        {
                            "You're currently not registered as a user of StaticDeploy. Ask an admin to create a user with the following parameters:"
                        }
                    </p>
                </div>
                <TextFieldRO title="Identity provider" value={idpInfo.idp} />
                <TextFieldRO
                    title="User id for the identity provider"
                    value={idpInfo.idpId}
                />
            </>
        );
    }
}
