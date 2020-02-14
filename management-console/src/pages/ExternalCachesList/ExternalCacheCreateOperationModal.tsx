import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import ExternalCacheForm, {
    IExternalCacheFormInstance
} from "../../components/ExternalCacheForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IExternalCache> {}

interface IProps {
    supportedExternalCacheTypes: IExternalCacheType[];
    history: History;
    trigger: React.ReactNode;
    refetchExternalCachesList: () => void;
}

export default class ExternalCacheCreateOperationModal extends React.Component<
    IProps
> {
    form!: IExternalCacheFormInstance;
    createExternalCache = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.externalCaches.create({
            domain: values.domain,
            type: values.type,
            configuration: values.configuration
        });
    };
    refetchExternalCachesListAndGoToExternalCacheDetail = (
        externalCache: IExternalCache
    ) => {
        this.props.refetchExternalCachesList();
        this.props.history.push(`/externalCaches/${externalCache.id}`);
    };
    render() {
        return (
            <OperationModal
                title="Create external cache"
                operation={this.createExternalCache}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={
                    this.refetchExternalCachesListAndGoToExternalCacheDetail
                }
                successMessage={createdExternalCache => (
                    <span>
                        {"Created external cache for "}
                        {emphasizeString(createdExternalCache.domain)}
                        {" with id "}
                        {emphasizeString(createdExternalCache.id)}
                    </span>
                )}
            >
                <ExternalCacheForm
                    ref={form => (this.form = form!)}
                    supportedExternalCacheTypes={
                        this.props.supportedExternalCacheTypes
                    }
                />
            </OperationModal>
        );
    }
}
