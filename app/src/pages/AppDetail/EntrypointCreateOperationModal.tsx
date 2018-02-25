import { IApp, IEntrypoint } from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import EntrypointForm, {
    IEntrypointFormInstance
} from "../../components/EntrypointForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IEntrypoint> {}

interface IProps {
    app: IApp;
    history: History;
    trigger: React.ReactNode;
}

export default class EntrypointCreateOperationModal extends React.Component<
    IProps
> {
    form: IEntrypointFormInstance | null;
    createEntrypoint = () => {
        if (!this.form!.isValid()) {
            this.form!.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.entrypoints.create({
            appId: this.props.app.id,
            urlMatcher: values.urlMatcher,
            fallbackResource: values.fallbackResource,
            configuration: values.configuration || undefined
        });
    };
    goToEntrypointDetail = (entrypoint: IEntrypoint) =>
        this.props.history.push(
            `/apps/${this.props.app.id}/entrypoints/${entrypoint.id}`
        );
    render() {
        return (
            <OperationModal
                title="Create app"
                operation={this.createEntrypoint}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={this.goToEntrypointDetail}
                successMessage={createdEntrypoint => (
                    <span>
                        {"Created entrypoint "}
                        {emphasizeString(createdEntrypoint.urlMatcher)}
                        {" with id "}
                        {emphasizeString(createdEntrypoint.id)}
                    </span>
                )}
            >
                <EntrypointForm ref={form => (this.form = form)} />
            </OperationModal>
        );
    }
}
