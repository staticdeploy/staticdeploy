import { IBundle } from "@staticdeploy/common-types";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import uniqBy from "lodash/uniqBy";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import BundlesList from "../../components/BundlesList";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";

const BundleNamesLinksList = LinksList as new () => LinksList<{
    id: string;
    name: string;
}>;
const BundleTagsLinksList = LinksList as new () => LinksList<{
    id: string;
    tag: string;
}>;

interface IProps {
    result: IBundle[];
    refetch: () => void;
}

class Bundles extends React.Component<IProps> {
    renderNamesList() {
        const names = uniqBy(this.props.result, "name").map(bundle => ({
            id: bundle.name,
            name: bundle.name
        }));
        return (
            <BundleNamesLinksList
                title="Names"
                items={names}
                getDescription={({ name }) => name}
                getHref={({ name }) => `/bundles/${name}`}
            />
        );
    }
    renderTagsList = (
        routeProps: RouteComponentProps<{ bundleName: string }>
    ) => {
        const { bundleName } = routeProps.match.params;
        const bundlesByName = this.props.result.filter(
            bundle => bundle.name === bundleName
        );
        const tags = uniqBy(bundlesByName, "tag").map(bundle => ({
            id: bundle.tag,
            tag: bundle.tag
        }));
        return (
            <BundleTagsLinksList
                title="Tags"
                items={tags}
                getDescription={({ tag }) => tag}
                getHref={({ tag }) => `/bundles/${bundleName}/${tag}`}
            />
        );
    };
    renderNameTagCombinationDetail = (
        routeProps: RouteComponentProps<{
            bundleName: string;
            bundleTag: string;
        }>
    ) => {
        const { bundleName, bundleTag } = routeProps.match.params;
        const bundlesByNameAndTag = this.props.result.filter(
            bundle => bundle.name === bundleName && bundle.tag === bundleTag
        );
        return (
            <>
                <TextFieldRO
                    title="Bundle"
                    value={`${bundleName}:${bundleTag}`}
                />
                <BundlesList title="History" bundles={bundlesByNameAndTag} />
            </>
        );
    };
    render() {
        return (
            <Page title="Bundles">
                <Row gutter={32}>
                    <Col span={5}>{this.renderNamesList()}</Col>
                    <Col span={5}>
                        <Route
                            path="/bundles/:bundleName"
                            render={this.renderTagsList}
                        />
                    </Col>
                    <Col span={14}>
                        <Route
                            path="/bundles/:bundleName/:bundleTag"
                            render={this.renderNameTagCombinationDetail}
                        />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default withData({
    fetchData: () => staticdeploy.bundles.getAll(),
    spinnerSize: "large",
    spinnerTip: "Fetching bundles...",
    Component: Bundles
});
