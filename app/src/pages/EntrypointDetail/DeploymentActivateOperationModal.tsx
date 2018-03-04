import { IDeployment, IEntrypoint } from "@staticdeploy/sdk";
import format from "date-fns/format";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import BaseOperationModal from "../../components/OperationModal";
import TextFieldRO from "../../components/TextFieldRO";

class OperationModal extends BaseOperationModal<IEntrypoint> {}

interface IProps {
    entrypoint: IEntrypoint;
    deployment: IDeployment;
    trigger: React.ReactNode;
    refetch: () => void;
}

export default class DeploymentActivateOperationModal extends React.Component<
    IProps
> {
    activateDeployment = () =>
        staticdeploy.entrypoints.update(this.props.entrypoint.id, {
            activeDeploymentId: this.props.deployment.id
        });
    refetchEntrypoint = () => this.props.refetch();
    render() {
        const { deployment, entrypoint } = this.props;
        return (
            <OperationModal
                title="Set active deployment"
                operation={this.activateDeployment}
                trigger={this.props.trigger}
                startOperationButtonText="Set as active"
                onAfterSuccessClose={this.refetchEntrypoint}
                successMessage="Deployment set as active"
            >
                <TextFieldRO
                    title="Description"
                    value={deployment.description || "No description"}
                />
                <TextFieldRO
                    title="Created at"
                    value={format(
                        deployment.createdAt,
                        "YYYY-MM-DD HH:mm:ss Z"
                    )}
                />
                <p>
                    {"Set as the active deployment on entrypoint "}
                    {emphasizeString(entrypoint.urlMatcher)}
                    {"?"}
                </p>
            </OperationModal>
        );
    }
}
