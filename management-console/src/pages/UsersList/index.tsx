import { IGroup, IUser, UserType } from "@staticdeploy/core";
import Icon from "antd/lib/icon";
import isNil from "lodash/isNil";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import staticdeploy from "../../common/staticdeployClient";
import { withData } from "../../components/DataFetcher";
import LinksList from "../../components/LinksList";
import ODItem from "../../components/OperationsDropdown/Item";
import Page from "../../components/Page";
import "./index.css";
import UserCreateOperationModal from "./UserCreateOperationModal";

const UsersLinksList = LinksList as new () => LinksList<IUser>;

interface IUrlParams {
    userId?: string;
}
interface IResult {
    groups: IGroup[];
    users: IUser[];
}
type Props = {
    result: IResult;
    refetch: () => void;
} & RouteComponentProps<IUrlParams>;

class UsersList extends React.Component<Props> {
    getActions() {
        return [
            <UserCreateOperationModal
                key="UserCreateOperationModal"
                groups={this.props.result.groups}
                history={this.props.history}
                trigger={<ODItem icon="plus" label="Create user" />}
                refetchUsersList={this.props.refetch}
            />
        ];
    }
    render() {
        return (
            <Page title="Users list" actions={this.getActions()}>
                <UsersLinksList
                    title="Users"
                    items={this.props.result.users}
                    getDescription={user => (
                        <>
                            <Icon
                                type={
                                    user.type === UserType.Human
                                        ? "user"
                                        : "robot"
                                }
                            />
                            <span className="v-UsersList-user-name">
                                {user.name}
                            </span>
                        </>
                    )}
                    getHref={user => `/users/${user.id}`}
                />
            </Page>
        );
    }
}

export default withData({
    fetchData: async () => {
        const [groups, users] = await Promise.all([
            staticdeploy.groups.getAll(),
            staticdeploy.users.getAll()
        ]);
        return { groups, users };
    },
    // Refetch when:
    shouldRefetch: (oldProps, newProps) =>
        // - the user was on the user detail page, and switched to the users
        //   list page. This happens when an user is deleted, in which case we
        //   want to refetch the users list. It also happens in other
        //   circumstances, for instance when the user navigates to /users, but
        //   we're ok refetching even then
        !isNil(oldProps.match.params.userId) &&
        isNil(newProps.match.params.userId),
    spinnerSize: "large",
    spinnerTip: "Fetching users...",
    Component: UsersList
});
