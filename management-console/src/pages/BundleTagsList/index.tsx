import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import Page from "../../components/Page";

interface IUrlParams {
    bundleName: string;
    bundleTag?: string;
}

const BundleTagsLinksList = LinksList as new () => LinksList<{
    id: string;
    tag: string;
}>;

type Props = {
    result: string[];
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class BundleTagsList extends React.Component<Props> {
    render() {
        const { bundleName } = this.props.match.params;
        return (
            <Page title="Bundle tags">
                <BundleTagsLinksList
                    title="Tags"
                    items={this.props.result.map(tag => ({
                        id: tag,
                        tag: tag
                    }))}
                    getDescription={({ tag }) => tag}
                    getHref={({ tag }) => `/bundles/${bundleName}/${tag}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: props =>
        staticdeploy.bundles.getTagsByName(props.match.params.bundleName),
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the selected bundle name changes
        oldProps.match.params.bundleName !== newProps.match.params.bundleName ||
        // - the user was on the bundles-by-name-tag page, and switched to the tags list
        //   page. This happens when a bundle name:tag is deleted, in which case we want to
        //   refetch the tags list
        (!isNil(oldProps.match.params.bundleTag) &&
            isNil(newProps.match.params.bundleTag)),
    spinnerSize: "large",
    spinnerTip: "Fetching bundle tags...",
    Component: BundleTagsList
});
