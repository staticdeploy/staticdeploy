import { IBundle } from "@staticdeploy/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import BundlesList from "../../components/BundlesList";
import { withData } from "../../components/DataFetcher";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import BundlesDeleteOperationModal from "./BundlesDeleteOperationModal";

interface IUrlParams {
    bundleName: string;
    bundleTag: string;
}

type Props = {
    result: IBundle[];
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class BundlesByNameTag extends React.Component<Props> {
    getActions() {
        const { history } = this.props;
        const { bundleName, bundleTag } = this.props.match.params;
        return [
            <BundlesDeleteOperationModal
                key="BundlesDeleteOperationModal"
                bundleName={bundleName}
                bundleTag={bundleTag}
                history={history}
                trigger={<ODItem icon="delete" label="Delete bundles" />}
            />,
        ];
    }
    render() {
        const { bundleName, bundleTag } = this.props.match.params;
        return (
            <Page title="Bundles" actions={this.getActions()}>
                <TextFieldRO
                    title="Bundle"
                    value={`${bundleName}:${bundleTag}`}
                />
                <BundlesList title="History" bundles={this.props.result} />
            </Page>
        );
    }
}

export default withData({
    fetchData: (staticdeploy, props) => {
        const { bundleName, bundleTag } = props.match.params;
        return staticdeploy.bundles.getByNameAndTag(bundleName, bundleTag);
    },
    shouldRefetch: (oldProps, newProps) =>
        oldProps.match.params.bundleName !== newProps.match.params.bundleName ||
        oldProps.match.params.bundleTag !== newProps.match.params.bundleTag,
    spinnerSize: "large",
    spinnerTip: "Fetching bundles...",
    Component: BundlesByNameTag,
});
