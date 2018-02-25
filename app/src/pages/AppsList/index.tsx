import { IApp } from "@staticdeploy/sdk";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import AppCreateOperationModal from "./AppCreateOperationModal";
import "./index.css";

interface IProps {
    result: IApp[];
    refetch: () => void;
}

const AppsLinksList = LinksList as new () => LinksList<IApp>;

class AppsList extends React.Component<IProps & RouteComponentProps<any>> {
    getActions() {
        return [
            <AppCreateOperationModal
                key="AppCreateOperationModal"
                history={this.props.history}
                trigger={<ODItem icon="plus" label="Create app" />}
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
    spinnerSize: "large",
    spinnerTip: "Fetching apps...",
    Component: AppsList
});
