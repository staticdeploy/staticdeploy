import { IApp, IEntrypoint } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import EntrypointForm, {
    IEntrypointFormInstance,
} from "../../components/EntrypointForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IEntrypoint> {}

interface IProps {
    app: IApp;
    history: History;
    trigger: React.ReactNode;
    refetchAppDetail: () => void;
}

export default class EntrypointCreateOperationModal extends React.Component<IProps> {
    form!: IEntrypointFormInstance;
    createEntrypoint = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.entrypoints.create({
            appId: this.props.app.id,
            bundleId: values.bundleId,
            redirectTo: values.redirectTo,
            urlMatcher: values.urlMatcher,
            configuration: values.configuration || undefined,
        });
    };
    refetchAppDetailAndGoToEntrypointDetail = (entrypoint: IEntrypoint) => {
        this.props.refetchAppDetail();
        this.props.history.push(
            `/apps/${this.props.app.id}/entrypoints/${entrypoint.id}`
        );
    };
    render() {
        return (
            <OperationModal
                title="Create app"
                operation={this.createEntrypoint}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={
                    this.refetchAppDetailAndGoToEntrypointDetail
                }
                successMessage={(createdEntrypoint) => (
                    <span>
                        {"Created entrypoint "}
                        {emphasizeString(createdEntrypoint.urlMatcher)}
                        {" with id "}
                        {emphasizeString(createdEntrypoint.id)}
                    </span>
                )}
            >
                <EntrypointForm ref={(form) => (this.form = form!)} />
            </OperationModal>
        );
    }
}
