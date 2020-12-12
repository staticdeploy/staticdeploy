import { IEntrypoint } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    entrypoint: IEntrypoint;
    history: History;
    trigger: React.ReactNode;
}

export default class EntrypointDeleteOperationModal extends React.Component<IProps> {
    deleteEntrypoint = (staticdeploy: StaticdeployClient) =>
        staticdeploy.entrypoints.delete(this.props.entrypoint.id);
    goToAppDetail = () =>
        this.props.history.push(`/apps/${this.props.entrypoint.appId}`);
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete entrypoint"}
                        {emphasizeString(this.props.entrypoint.urlMatcher)}
                    </span>
                }
                operation={this.deleteEntrypoint}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToAppDetail}
                successMessage="Entrypoint deleted"
            >
                <div>
                    {"Are you sure you want to delete entrypoint "}
                    {emphasizeString(this.props.entrypoint.urlMatcher)}
                    {"?"}
                </div>
            </OperationModal>
        );
    }
}
