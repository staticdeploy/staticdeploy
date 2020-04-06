import { KeyOutlined } from "@ant-design/icons";
import Button from "antd/lib/button";
import React from "react";
import { InjectedFormProps } from "redux-form";

import { reduxForm } from "../../common/formWithValuesConverter";
import TextField from "../TextField";

interface IFormValues {
    jwt: string;
}
interface IJwtLoginFormProps {
    strategyDisplayName: string;
}
class WrappedJwtLoginForm extends React.Component<
    IJwtLoginFormProps & InjectedFormProps<IFormValues>
> {
    render() {
        const { handleSubmit, strategyDisplayName } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    className="c-LoginMask-JwtLoginForm-text-field"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
                    name="jwt"
                    inlineError={true}
                    addonBefore={<KeyOutlined rotate={180} />}
                />
                <Button className="c-LoginMask-login-button" htmlType="submit">
                    {`Login with ${strategyDisplayName}`}
                </Button>
            </form>
        );
    }
}
const JwtLoginForm = reduxForm<IFormValues, IFormValues, IJwtLoginFormProps>({
    form: "JwtLogin",
    touchOnBlur: false,
    validate: (formValues) => (!formValues.jwt ? { jwt: "Required" } : {}),
})(WrappedJwtLoginForm);

interface IProps {
    onLogin: (jwt: string) => any;
    strategyDisplayName: string;
}
export default class JwtLogin extends React.Component<IProps> {
    render() {
        return (
            <JwtLoginForm
                onSubmit={({ jwt }) => {
                    this.props.onLogin(jwt);
                }}
                strategyDisplayName={this.props.strategyDisplayName}
            />
        );
    }
}
