import React from "react";

import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import Page from "../../components/Page";

const BundleNamesLinksList = LinksList as new () => LinksList<{
    id: string;
    name: string;
}>;

interface IProps {
    result: string[];
    refetch: () => void;
}

class BundleNamesList extends React.Component<IProps> {
    render() {
        return (
            <Page title="Bundle names">
                <BundleNamesLinksList
                    title="Names"
                    items={this.props.result.map((name) => ({
                        id: name,
                        name: name,
                    }))}
                    getDescription={({ name }) => name}
                    getHref={({ name }) => `/bundles/${name}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: (staticdeploy) => staticdeploy.bundles.getNames(),
    spinnerSize: "large",
    spinnerTip: "Fetching bundle names...",
    Component: BundleNamesList,
});
