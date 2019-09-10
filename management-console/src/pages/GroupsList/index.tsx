import { IGroup } from "@staticdeploy/core";
import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import GroupCreateOperationModal from "./GroupCreateOperationModal";

const GroupsLinksList = LinksList as new () => LinksList<IGroup>;

interface IUrlParams {
    groupId?: string;
}
type Props = {
    result: IGroup[];
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class GroupsList extends React.Component<Props> {
    getActions() {
        return [
            <GroupCreateOperationModal
                key="GroupCreateOperationModal"
                history={this.props.history}
                trigger={<ODItem icon="plus" label="Create group" />}
                refetchGroupsList={this.props.refetch}
            />
        ];
    }
    render() {
        return (
            <Page title="Groups list" actions={this.getActions()}>
                <GroupsLinksList
                    title="Groups"
                    items={this.props.result}
                    getDescription={group => group.name}
                    getHref={group => `/groups/${group.id}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: () => staticdeploy.groups.getAll(),
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the user was on the group detail page, and switched to the groups
        //   list page. This happens when an group is deleted, in which case we
        //   want to refetch the groups list. It also happens in other
        //   circumstances, for instance when the user navigates to /groups, but
        //   we're ok refetching even then
        !isNil(oldProps.match.params.groupId) &&
        isNil(newProps.match.params.groupId),
    spinnerSize: "large",
    spinnerTip: "Fetching groups...",
    Component: GroupsList
});
