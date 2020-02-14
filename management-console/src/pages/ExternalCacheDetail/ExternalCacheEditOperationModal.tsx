import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import ExternalCacheForm, {
    IExternalCacheFormInstance
} from "../../components/ExternalCacheForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IExternalCache> {}

interface IProps {
    externalCache: IExternalCache;
    supportedExternalCacheTypes: IExternalCacheType[];
    history: History;
    location: Location;
    refetchExternalCacheDetail: () => void;
    trigger: React.ReactNode;
}

export default class ExternalCacheEditOperationModal extends React.Component<
    IProps
> {
    form!: IExternalCacheFormInstance;
    editExternalCache = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.externalCaches.update(this.props.externalCache.id, {
            domain: values.domain,
            type: values.type,
            configuration: values.configuration
        });
    };
    refetchExternalCacheDetail = () => this.props.refetchExternalCacheDetail();
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Edit external cache for "}
                        {emphasizeString(this.props.externalCache.domain)}
                    </span>
                }
                operation={this.editExternalCache}
                trigger={this.props.trigger}
                startOperationButtonText="Save"
                onAfterSuccessClose={this.refetchExternalCacheDetail}
                successMessage="External cache saved"
            >
                <ExternalCacheForm
                    initialValues={this.props.externalCache}
                    ref={form => (this.form = form!)}
                    supportedExternalCacheTypes={
                        this.props.supportedExternalCacheTypes
                    }
                />
            </OperationModal>
        );
    }
}
