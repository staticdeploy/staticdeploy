import { IApp, IEntrypoint } from "@staticdeploy/core";
import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ConfigurationFieldRO from "../../components/ConfigurationFieldRO";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import AppDeleteOperationModal from "./AppDeleteOperationModal";
import AppEditOperationModal from "./AppEditOperationModal";
import EntrypointCreateOperationModal from "./EntrypointCreateOperationModal";

const EntrypointsLinksList = LinksList as new () => LinksList<IEntrypoint>;

interface IUrlParams {
    appId: string;
    entrypointId?: string;
}
interface IResult {
    app: IApp;
    entrypoints: IEntrypoint[];
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class AppDetail extends React.Component<Props> {
    getActions() {
        const {
            history,
            location,
            refetch,
            result: { app }
        } = this.props;
        return [
            <AppEditOperationModal
                key="AppEditOperationModal"
                app={app}
                history={history}
                location={location}
                refetchAppDetail={refetch}
                trigger={<ODItem icon="edit" label="Edit app" />}
            />,
            <AppDeleteOperationModal
                key="AppDeleteOperationModal"
                app={app}
                history={history}
                trigger={<ODItem icon="delete" label="Delete app" />}
            />,
            <EntrypointCreateOperationModal
                key="EntrypointCreateOperationModal"
                app={app}
                history={history}
                trigger={<ODItem icon="plus" label="Create entrypoint" />}
                refetchAppDetail={refetch}
            />
        ];
    }
    render() {
        const { app, entrypoints } = this.props.result;
        return (
            <Page title="App detail" actions={this.getActions()}>
                <TextFieldRO title="Name" value={app.name} />
                <ConfigurationFieldRO
                    title="Default configuration"
                    configuration={app.defaultConfiguration}
                />
                <EntrypointsLinksList
                    title="Entrypoints"
                    items={entrypoints}
                    getDescription={entrypoint => entrypoint.urlMatcher}
                    getHref={entrypoint =>
                        `/apps/${app.id}/entrypoints/${entrypoint.id}`
                    }
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async (staticdeploy, props) => {
        const { appId } = props.match.params;
        const [app, entrypoints] = await Promise.all([
            staticdeploy.apps.getOne(appId),
            staticdeploy.entrypoints.getAll({ appId: appId })
        ]);
        return { app, entrypoints };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the app to show changed
        oldProps.match.params.appId !== newProps.match.params.appId ||
        // - the user was on the entrypoint detail page, and switched to the app
        //   detail page. This happens when an entrypoint is deleted, in which
        //   case we want to refetch the app data. It also happens in other
        //   circumstances, for instance when the user clicks on the app link in
        //   the apps list, but we're ok refetching even then
        (!isNil(oldProps.match.params.entrypointId) &&
            isNil(newProps.match.params.entrypointId)),
    spinnerSize: "large",
    spinnerTip: "Fetching app details...",
    Component: AppDetail
});
