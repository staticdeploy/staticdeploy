import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { withData } from "../../components/DataFetcher";
import ExternalCacheConfigurationFieldRO from "../../components/ExternalCacheConfigurationFieldRO";
import ExternalCacheTypeFieldRO from "../../components/ExternalCacheTypeFieldRO";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import ExternalCacheDeleteOperationModal from "./ExternalCacheDeleteOperationModal";
import ExternalCacheEditOperationModal from "./ExternalCacheEditOperationModal";

interface IUrlParams {
    externalCacheId: string;
}
interface IResult {
    externalCache: IExternalCache;
    supportedExternalCacheTypes: IExternalCacheType[];
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class ExternalCacheDetail extends React.Component<Props> {
    getActions() {
        const {
            history,
            location,
            refetch,
            result: { externalCache, supportedExternalCacheTypes }
        } = this.props;
        return [
            <ExternalCacheEditOperationModal
                key="ExternalCacheEditOperationModal"
                externalCache={externalCache}
                supportedExternalCacheTypes={supportedExternalCacheTypes}
                history={history}
                location={location}
                refetchExternalCacheDetail={refetch}
                trigger={<ODItem icon="edit" label="Edit external cache" />}
            />,
            <ExternalCacheDeleteOperationModal
                key="ExternalCacheDeleteOperationModal"
                externalCache={externalCache}
                history={history}
                trigger={<ODItem icon="delete" label="Delete external cache" />}
            />
        ];
    }
    render() {
        const {
            externalCache,
            supportedExternalCacheTypes
        } = this.props.result;
        return (
            <Page title="External cache detail" actions={this.getActions()}>
                <TextFieldRO title="Domain" value={externalCache.domain} />
                <ExternalCacheTypeFieldRO
                    title="Type"
                    externalCacheType={externalCache.type}
                    supportedExternalCacheTypes={supportedExternalCacheTypes}
                />
                <ExternalCacheConfigurationFieldRO
                    title="Configuration"
                    externalCacheType={externalCache.type}
                    externalCacheConfiguration={externalCache.configuration}
                    supportedExternalCacheTypes={supportedExternalCacheTypes}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async (staticdeploy, props) => {
        const { externalCacheId } = props.match.params;
        const [externalCache, supportedExternalCacheTypes] = await Promise.all([
            staticdeploy.externalCaches.getOne(externalCacheId),
            staticdeploy.externalCaches.getSupportedTypes()
        ]);
        return { externalCache, supportedExternalCacheTypes };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the externalCache to show changed
        oldProps.match.params.externalCacheId !==
        newProps.match.params.externalCacheId,
    spinnerSize: "large",
    spinnerTip: "Fetching external cache details...",
    Component: ExternalCacheDetail
});
