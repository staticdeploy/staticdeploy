import { IExternalCache } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    externalCache: IExternalCache;
    history: History;
    trigger: React.ReactNode;
}

export default class ExternalCacheDeleteOperationModal extends React.Component<
    IProps
> {
    deleteExternalCache = (staticdeploy: StaticdeployClient) =>
        staticdeploy.externalCaches.delete(this.props.externalCache.id);
    goToExternalCachesList = () => this.props.history.push("/externalCaches");
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete external cache for "}
                        {emphasizeString(this.props.externalCache.domain)}
                    </span>
                }
                operation={this.deleteExternalCache}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToExternalCachesList}
                successMessage="External cache deleted"
            >
                <div>
                    {"Are you sure you want to delete external cache for "}
                    {emphasizeString(this.props.externalCache.domain)}
                    {"?"}
                </div>
            </OperationModal>
        );
    }
}
