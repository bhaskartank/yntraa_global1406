import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import userRolesRedux from "store/modules/user-roles";
import userRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import TabBox from "components/molecules/TabBox";
import ListUser from "components/templates/user/ListUser";
import ListUserRole from "components/templates/user/ListUserRole";

import { pageTitles } from "utils/constants";

const ListUserPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const users = userRedux.getters.users(rootState);
  const userRoles = userRolesRedux.getters.userRoles(rootState);

  const fetchUsers = useCallback(
    async (payload) => {
      dispatch(userRedux.actions.users(payload));
    },
    [dispatch],
  );

  const fetchUserRoles = useCallback(
    async (payload) => {
      dispatch(userRolesRedux.actions.userRoles(payload));
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_USER}>
      <TabBox
        tabs={[
          {
            title: pageTitles?.PAGE_TITLE_USER_LIST,
            content: <ListUser list={users?.list} totalRecords={users?.totalRecords} fetchList={fetchUsers} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_USER_ROLE_LIST,
            content: <ListUserRole list={userRoles?.list} totalRecords={userRoles?.totalRecords} fetchList={fetchUserRoles} />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default ListUserPage;
