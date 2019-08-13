import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import React from "react";
import { InjectedFormProps } from "redux-form";

import { reduxForm } from "../../common/formWithValuesConverter";
import TextField from "../TextField";

interface IFormValues {
    jwt: string;
}
class WrappedJwtLoginForm extends React.Component<
    InjectedFormProps<IFormValues>
> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <h4>{"Login with JWT"}</h4>
                <TextField
                    className="c-LoginMask-JwtLoginForm-text-field"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
                    name="jwt"
                    inlineError={true}
                    addonBefore={<Icon type="key" rotate={180} />}
                />
                <Button className="c-LoginMask-login-button" htmlType="submit">
                    {"Login"}
                </Button>
            </form>
        );
    }
}
const JwtLoginForm = reduxForm<IFormValues, IFormValues>({
    form: "JwtLogin",
    touchOnBlur: false,
    validate: formValues => (!formValues.jwt ? { jwt: "Required" } : {})
})(WrappedJwtLoginForm);

interface IProps {
    onLogin: (jwt: string) => any;
}
export default class JwtLogin extends React.Component<IProps> {
    render() {
        return (
            <JwtLoginForm
                onSubmit={({ jwt }) => {
                    this.props.onLogin(jwt);
                }}
            />
        );
    }
}
