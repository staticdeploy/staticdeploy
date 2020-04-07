import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { IGroup } from "@staticdeploy/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { withData } from "../../components/DataFetcher";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import RolesFieldRO from "../../components/RolesFieldRO";
import TextFieldRO from "../../components/TextFieldRO";
import GroupDeleteOperationModal from "./GroupDeleteOperationModal";
import GroupEditOperationModal from "./GroupEditOperationModal";

interface IUrlParams {
    groupId: string;
}
interface IResult {
    group: IGroup;
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class GroupDetail extends React.Component<Props> {
    getActions() {
        const {
            history,
            location,
            refetch,
            result: { group },
        } = this.props;
        return [
            <GroupEditOperationModal
                key="GroupEditOperationModal"
                group={group}
                history={history}
                location={location}
                refetchGroupDetail={refetch}
                trigger={<ODItem icon={<EditOutlined />} label="Edit group" />}
            />,
            <GroupDeleteOperationModal
                key="GroupDeleteOperationModal"
                group={group}
                history={history}
                trigger={
                    <ODItem icon={<DeleteOutlined />} label="Delete group" />
                }
            />,
        ];
    }
    render() {
        const { group } = this.props.result;
        return (
            <Page title="Group detail" actions={this.getActions()}>
                <TextFieldRO title="Name" value={group.name} />
                <RolesFieldRO title="Roles" roles={group.roles} />
            </Page>
        );
    }
}

export default withData({
    fetchData: async (staticdeploy, props) => {
        const { groupId } = props.match.params;
        const group = await staticdeploy.groups.getOne(groupId);
        return { group };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the group to show changed
        oldProps.match.params.groupId !== newProps.match.params.groupId,
    spinnerSize: "large",
    spinnerTip: "Fetching group details...",
    Component: GroupDetail,
});
