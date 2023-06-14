import { useDispatch, useSelector } from "store";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListUserDetails from "components/templates/users/user/ListUserDetails";
import { useCallback, useState } from "react";

const ListUserDetailsPage = () => {
  const rootState = useSelector((state: any) => state);
  const users = usersRedux.getters.userDetails(rootState);
  const dispatch = useDispatch();
  const [ssoUserDetails,setSSOUserDetails]=useState<any>([]);

  const fetchUserDetailsFromSSO = useCallback(
    async (userId) => {
      const data=await dispatch(usersRedux.actions.fetchUserDetailsFromSSO(userId));
      setSSOUserDetails(data);
    },
    [dispatch],
  );
  const handleSyncUser = useCallback(
    (userId) => {
      dispatch(usersRedux.actions.syncUserWithSSO(userId));
    },
    [dispatch],
  );


  return (
    <PageContainer title="User Details" breadcrumbs={[{ label: "Users List", to: "/users/all-users" }, { label: "View Details" }]}>
      {<ListUserDetails requestData={users.list} fetchUserDetailsFromSSO={fetchUserDetailsFromSSO} handleSyncUser={handleSyncUser} ssoUserDetails={ssoUserDetails} />}
    </PageContainer>
  );
};

export default ListUserDetailsPage;
