import { IApp } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import AppForm, { IAppFormInstance } from "../../components/AppForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IApp> {}

interface IProps {
    app: IApp;
    history: History;
    location: Location;
    refetchAppDetail: () => void;
    trigger: React.ReactNode;
}

export default class AppEditOperationModal extends React.Component<IProps> {
    form!: IAppFormInstance;
    editApp = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.apps.update(this.props.app.id, {
            defaultConfiguration: values.defaultConfiguration,
        });
    };
    refetchAppDetailAndGoToAppDetail = (app: IApp) => {
        const targetPath = `/apps/${app.id}`;
        // If on the entrypoint detail page, go back to the app detail page.
        // This is to avoid the entrypoint detail page showing stale data about
        // the app (in particular, a stale app.defaultConfiguration)
        if (this.props.location.pathname !== targetPath) {
            this.props.history.push(targetPath);
        }
        this.props.refetchAppDetail();
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
                onAfterSuccessClose={this.refetchAppDetailAndGoToAppDetail}
                successMessage="App saved"
            >
                <AppForm
                    isEditForm={true}
                    initialValues={this.props.app}
                    ref={(form) => (this.form = form!)}
                />
            </OperationModal>
        );
    }
}
