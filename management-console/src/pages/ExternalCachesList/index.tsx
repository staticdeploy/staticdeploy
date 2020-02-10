import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import ExternalCacheCreateOperationModal from "./ExternalCacheCreateOperationModal";

const ExternalCachesLinksList = LinksList as new () => LinksList<
    IExternalCache
>;

interface IUrlParams {
    externalCacheId?: string;
}
interface IResult {
    externalCaches: IExternalCache[];
    supportedExternalCacheTypes: IExternalCacheType[];
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class ExternalCachesList extends React.Component<Props> {
    getActions() {
        return [
            <ExternalCacheCreateOperationModal
                key="ExternalCacheCreateOperationModal"
                supportedExternalCacheTypes={
                    this.props.result.supportedExternalCacheTypes
                }
                history={this.props.history}
                trigger={<ODItem icon="plus" label="Create external cache" />}
                refetchExternalCachesList={this.props.refetch}
            />
        ];
    }
    render() {
        return (
            <Page title="External caches list" actions={this.getActions()}>
                <ExternalCachesLinksList
                    title="External caches"
                    items={this.props.result.externalCaches}
                    getDescription={externalCache => externalCache.domain}
                    getHref={externalCache =>
                        `/externalCaches/${externalCache.id}`
                    }
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async staticdeploy => {
        const [
            externalCaches,
            supportedExternalCacheTypes
        ] = await Promise.all([
            staticdeploy.externalCaches.getAll(),
            staticdeploy.externalCaches.getSupportedTypes()
        ]);
        return { externalCaches, supportedExternalCacheTypes };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the user was on the externalCache detail page, and switched to the
        //   externalCaches list page. This happens when an externalCache is
        //   deleted, in which case we want to refetch the externalCaches list.
        //   It also happens in other circumstances, for instance when the user
        //   navigates to /externalCaches, but we're ok refetching even then
        !isNil(oldProps.match.params.externalCacheId) &&
        isNil(newProps.match.params.externalCacheId),
    spinnerSize: "large",
    spinnerTip: "Fetching external caches...",
    Component: ExternalCachesList
});
