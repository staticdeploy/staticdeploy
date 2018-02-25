import { IApp, IDeployment, IEntrypoint } from "@staticdeploy/sdk";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import ConfigurationFieldRO from "../../components/ConfigurationFieldRO";
import { withData } from "../../components/DataFetcher";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import DeploymentsList from "./DeploymentsList";
import EntrypointDeleteOperationModal from "./EntrypointDeleteOperationModal";
import EntrypointEditOperationModal from "./EntrypointEditOperationModal";

interface IUrlParams {
    appId: string;
    entrypointId: string;
}
interface IResult {
    app: IApp;
    entrypoint: IEntrypoint;
    deployments: IDeployment[];
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class EntrypointDetail extends React.Component<Props> {
    getActions() {
        return [
            <EntrypointEditOperationModal
                key="EntrypointEditOperationModal"
                entrypoint={this.props.result.entrypoint}
                refetch={this.props.refetch}
                trigger={<ODItem icon="edit" label="Edit entrypoint" />}
            />,
            <EntrypointDeleteOperationModal
                key="EntrypointDeleteOperationModal"
                entrypoint={this.props.result.entrypoint}
                history={this.props.history}
                trigger={<ODItem icon="delete" label="Delete entrypoint" />}
            />
        ];
    }
    render() {
        const { app, entrypoint, deployments } = this.props.result;
        return (
            <Page title="Entrypoint detail" actions={this.getActions()}>
                <TextFieldRO title="App" value={app.name} />
                <TextFieldRO
                    title="Url matcher"
                    value={entrypoint.urlMatcher}
                />
                <TextFieldRO
                    title="Fallback resource"
                    value={entrypoint.fallbackResource}
                />
                <ConfigurationFieldRO
                    title={
                        entrypoint.configuration
                            ? "Configuration (different from app's default)"
                            : "Configuration (app's default)"
                    }
                    configuration={
                        entrypoint.configuration || app.defaultConfiguration
                    }
                />
                <DeploymentsList
                    title="Deployments"
                    entrypoint={entrypoint}
                    deployments={deployments}
                    refetch={this.props.refetch}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async props => {
        const { appId, entrypointId } = props.match.params;
        const [app, entrypoint, deployments] = await Promise.all([
            staticdeploy.apps.getOne(appId),
            staticdeploy.entrypoints.getOne(entrypointId),
            staticdeploy.deployments.getAll({
                entrypointIdOrUrlMatcher: entrypointId
            })
        ]);
        return { app, entrypoint, deployments };
    },
    shouldRefetch: (oldProps, newProps) =>
        oldProps.match.params.appId !== newProps.match.params.appId ||
        oldProps.match.params.entrypointId !==
            newProps.match.params.entrypointId,
    spinnerSize: "large",
    spinnerTip: "Fetching entrypoint details...",
    Component: EntrypointDetail
});
