import Button from "antd/lib/button";
import Card from "antd/lib/card";
import React from "react";
import { InjectedFormProps } from "redux-form";

import { reduxForm } from "../../common/formWithValuesConverter";
import TextField from "../TextField";

export interface IFormValues {
    authToken: string;
}

class LoginForm extends React.Component<InjectedFormProps<IFormValues>> {
    render() {
        return (
            <Card>
                <form onSubmit={this.props.handleSubmit}>
                    <TextField
                        label="Set auth token to login"
                        placeholder="Auth token"
                        name="authToken"
                    />
                    <Button htmlType="submit">{"Login"}</Button>
                </form>
            </Card>
        );
    }
}

export default reduxForm<IFormValues, IFormValues>({
    form: "LoginForm",
    validate: formValues =>
        !formValues.authToken ? { authToken: "Required" } : {}
})(LoginForm);
