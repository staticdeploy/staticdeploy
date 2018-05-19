import { IApp } from "@staticdeploy/common-types";
import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import AppCreateOperationModal from "./AppCreateOperationModal";

const AppsLinksList = LinksList as new () => LinksList<IApp>;

interface IUrlParams {
    appId?: string;
}
type Props = {
    result: IApp[];
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class AppsList extends React.Component<Props> {
    getActions() {
        return [
            <AppCreateOperationModal
                key="AppCreateOperationModal"
                history={this.props.history}
                trigger={<ODItem icon="plus" label="Create app" />}
                refetchAppsList={this.props.refetch}
            />
        ];
    }
    render() {
        return (
            <Page title="Apps list" actions={this.getActions()}>
                <AppsLinksList
                    title="Apps"
                    items={this.props.result}
                    getDescription={app => app.name}
                    getHref={app => `/apps/${app.id}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: () => staticdeploy.apps.getAll(),
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the user was on the app detail page, and switched to the apps list
        //   page. This happens when an app is deleted, in which case we want to
        //   refetch the apps list. It also happens in other circumstances, for
        //   instance when the user navigates to /apps, but we're ok refetching
        //   even then
        !isNil(oldProps.match.params.appId) &&
        isNil(newProps.match.params.appId),
    spinnerSize: "large",
    spinnerTip: "Fetching apps...",
    Component: AppsList
});
