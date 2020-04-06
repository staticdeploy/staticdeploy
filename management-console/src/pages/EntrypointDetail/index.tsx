import { IApp, IBundle, IEntrypoint } from "@staticdeploy/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ConfigurationFieldRO from "../../components/ConfigurationFieldRO";
import { withData } from "../../components/DataFetcher";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import EntrypointDeleteOperationModal from "./EntrypointDeleteOperationModal";
import EntrypointEditOperationModal from "./EntrypointEditOperationModal";

interface IUrlParams {
    appId: string;
    entrypointId: string;
}
interface IResult {
    app: IApp;
    entrypoint: IEntrypoint;
    bundle: IBundle | null;
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
                refetchEntrypointDetail={this.props.refetch}
                trigger={<ODItem icon="edit" label="Edit entrypoint" />}
            />,
            <EntrypointDeleteOperationModal
                key="EntrypointDeleteOperationModal"
                entrypoint={this.props.result.entrypoint}
                history={this.props.history}
                trigger={<ODItem icon="delete" label="Delete entrypoint" />}
            />,
        ];
    }
    render() {
        const { app, entrypoint, bundle } = this.props.result;
        return (
            <Page title="Entrypoint detail" actions={this.getActions()}>
                <TextFieldRO
                    title="Url matcher"
                    value={
                        <a
                            href={`http://${entrypoint.urlMatcher}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {entrypoint.urlMatcher}
                        </a>
                    }
                />
                <TextFieldRO
                    title="Deployed bundle"
                    value={
                        bundle
                            ? `${bundle.name}:${bundle.tag} (${bundle.id})`
                            : "No bundle deployed"
                    }
                />
                <TextFieldRO
                    title="Redirects to"
                    value={
                        entrypoint.redirectTo ? (
                            <a
                                href={entrypoint.redirectTo}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {entrypoint.redirectTo}
                            </a>
                        ) : (
                            "No redirect configured"
                        )
                    }
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
            </Page>
        );
    }
}

export default withData({
    fetchData: async (staticdeploy, props) => {
        const { appId, entrypointId } = props.match.params;
        const [app, entrypoint] = await Promise.all([
            staticdeploy.apps.getOne(appId),
            staticdeploy.entrypoints.getOne(entrypointId),
        ]);
        const bundle = entrypoint.bundleId
            ? await staticdeploy.bundles.getOne(entrypoint.bundleId)
            : null;
        return { app, entrypoint, bundle };
    },
    shouldRefetch: (oldProps, newProps) =>
        oldProps.match.params.appId !== newProps.match.params.appId ||
        oldProps.match.params.entrypointId !==
            newProps.match.params.entrypointId,
    spinnerSize: "large",
    spinnerTip: "Fetching entrypoint details...",
    Component: EntrypointDetail,
});
