import { IBundle } from "@staticdeploy/common-types";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import BundlesList from "../../components/BundlesList";
import { withData } from "../../components/DataFetcher";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";

interface IUrlParams {
    bundleName: string;
    bundleTag: string;
}

type Props = {
    result: IBundle[];
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class BundlesByNameTag extends React.Component<Props> {
    render() {
        const { bundleName, bundleTag } = this.props.match.params;
        return (
            <Page title="Bundles">
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
    fetchData: props => {
        const { bundleName, bundleTag } = props.match.params;
        return staticdeploy.bundles.getByNameAndTag(bundleName, bundleTag);
    },
    shouldRefetch: (oldProps, newProps) =>
        oldProps.match.params.bundleName !== newProps.match.params.bundleName ||
        oldProps.match.params.bundleTag !== newProps.match.params.bundleTag,
    spinnerSize: "large",
    spinnerTip: "Fetching bundles...",
    Component: BundlesByNameTag
});
