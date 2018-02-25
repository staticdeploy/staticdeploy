import { IApp, IEntrypoint } from "@staticdeploy/sdk";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
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
        const { history, location, refetch, result: { app } } = this.props;
        return [
            <AppEditOperationModal
                key="AppEditOperationModal"
                app={app}
                history={history}
                location={location}
                refetch={refetch}
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
    fetchData: async props => {
        const { appId } = props.match.params;
        const [app, entrypoints] = await Promise.all([
            staticdeploy.apps.getOne(appId),
            staticdeploy.entrypoints.getAll({ appIdOrName: appId })
        ]);
        return { app, entrypoints };
    },
    shouldRefetch: (oldProps, newProps) =>
        oldProps.match.params.appId !== newProps.match.params.appId,
    spinnerSize: "large",
    spinnerTip: "Fetching app details...",
    Component: AppDetail
});
