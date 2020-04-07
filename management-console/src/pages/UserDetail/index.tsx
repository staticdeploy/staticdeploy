import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { IGroup, IUserWithGroups } from "@staticdeploy/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import TextFieldRO from "../../components/TextFieldRO";
import UserTypeFieldRO from "../../components/UserTypeFieldRO";
import UserDeleteOperationModal from "./UserDeleteOperationModal";
import UserEditOperationModal from "./UserEditOperationModal";

const GroupsLinksList = LinksList as new () => LinksList<IGroup>;

interface IUrlParams {
    userId: string;
}
interface IResult {
    groups: IGroup[];
    user: IUserWithGroups;
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class UserDetail extends React.Component<Props> {
    getActions() {
        const {
            history,
            location,
            refetch,
            result: { groups, user },
        } = this.props;
        return [
            <UserEditOperationModal
                key="UserEditOperationModal"
                groups={groups}
                user={user}
                history={history}
                location={location}
                refetchUserDetail={refetch}
                trigger={<ODItem icon={<EditOutlined />} label="Edit user" />}
            />,
            <UserDeleteOperationModal
                key="UserDeleteOperationModal"
                user={user}
                history={history}
                trigger={
                    <ODItem icon={<DeleteOutlined />} label="Delete user" />
                }
            />,
        ];
    }
    render() {
        const { user } = this.props.result;
        return (
            <Page title="User detail" actions={this.getActions()}>
                <TextFieldRO title="Identity provider" value={user.idp} />
                <TextFieldRO
                    title="User id for the identity provider"
                    value={user.idpId}
                />
                <UserTypeFieldRO title="Type" userType={user.type} />
                <TextFieldRO title="Name" value={user.name} />
                <GroupsLinksList
                    title="Groups"
                    items={user.groups}
                    getDescription={(group) => group.name}
                    getHref={(group) => `/users/${user.id}/groups/${group.id}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async (staticdeploy, props) => {
        const { userId } = props.match.params;
        const [groups, user] = await Promise.all([
            staticdeploy.groups.getAll(),
            staticdeploy.users.getOne(userId),
        ]);
        return { groups, user };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the user to show changed
        oldProps.match.params.userId !== newProps.match.params.userId,
    spinnerSize: "large",
    spinnerTip: "Fetching user details...",
    Component: UserDetail,
});
