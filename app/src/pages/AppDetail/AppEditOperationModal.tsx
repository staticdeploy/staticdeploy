import { IApp } from "@staticdeploy/sdk";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import AppForm, { IAppFormInstance } from "../../components/AppForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IApp> {}

interface IProps {
    app: IApp;
    history: History;
    location: Location;
    refetch: () => void;
    trigger: React.ReactNode;
}

export default class AppEditOperationModal extends React.Component<IProps> {
    form: IAppFormInstance | null;
    editApp = () => {
        if (!this.form!.isValid()) {
            this.form!.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.apps.update(this.props.app.id, values);
    };
    goToAppDetailAndReFetchApp = (app: IApp) => {
        const targetPath = `/apps/${app.id}`;
        if (this.props.location.pathname !== targetPath) {
            this.props.history.push(targetPath);
        }
        this.props.refetch();
    };
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Edit app "}
                        {emphasizeString(this.props.app.name)}
                    </span>
                }
                operation={this.editApp}
                trigger={this.props.trigger}
                startOperationButtonText="Save"
                onAfterSuccessClose={this.goToAppDetailAndReFetchApp}
                successMessage="App saved"
            >
                <AppForm
                    initialValues={this.props.app}
                    ref={form => (this.form = form)}
                />
            </OperationModal>
        );
    }
}
