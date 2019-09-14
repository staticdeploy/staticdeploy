import { IApp } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    app: IApp;
    history: History;
    trigger: React.ReactNode;
}

export default class AppDeleteOperationModal extends React.Component<IProps> {
    deleteApp = (staticdeploy: StaticdeployClient) =>
        staticdeploy.apps.delete(this.props.app.id);
    goToAppsList = () => this.props.history.push("/apps");
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete app "}
                        {emphasizeString(this.props.app.name)}
                    </span>
                }
                operation={this.deleteApp}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToAppsList}
                successMessage="App deleted"
            >
                <div>
                    {"Are you sure you want to delete app "}
                    {emphasizeString(this.props.app.name)}
                    {"?"}
                </div>
            </OperationModal>
        );
    }
}
