import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    bundleName: string;
    bundleTag: string;
    history: History;
    trigger: React.ReactNode;
}

export default class BundlesDeleteOperationModal extends React.Component<IProps> {
    deleteBundles = (staticdeploy: StaticdeployClient) =>
        staticdeploy.bundles.deleteByNameAndTag(
            this.props.bundleName,
            this.props.bundleTag
        );
    goToBundleTagsList = () =>
        this.props.history.push(`/bundles/${this.props.bundleName}`);
    render() {
        const { bundleName, bundleTag } = this.props;
        const nameTagCombination = `${bundleName}:${bundleTag}`;
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete bundles "}
                        {emphasizeString(nameTagCombination)}
                    </span>
                }
                operation={this.deleteBundles}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToBundleTagsList}
                successMessage="Bundles deleted"
            >
                <div>
                    {"Are you sure you want to delete all "}
                    {emphasizeString(nameTagCombination)}
                    {" bundles?"}
                </div>
            </OperationModal>
        );
    }
}
