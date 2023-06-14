import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListUsers from "components/templates/users/user/ListUsers";

const ListUserPage = () => {
  const datalistKey = useCurrentPath();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUsers = useCallback(
    (payload) => {
      dispatch(usersRedux.actions.users(payload));
    },
    [dispatch],
  );

  const exportUsers = useCallback(async () => {
    try {
      return await dispatch(usersRedux.actions.exportUsers());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const resetPassword = useCallback(
    (userId) => {
      dispatch(usersRedux.actions.resetPassword(userId));
    },
    [dispatch],
  );
  const handleSyncUser = useCallback(
    (userId) => {
      dispatch(usersRedux.actions.syncUserWithSSO(userId));
    },
    [dispatch],
  );
  const blockUser = useCallback(
    async (userId) => {
      await dispatch(usersRedux.actions.blockUser(userId));
      dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
    },
    [dispatch],
  );
  const unblockUser = useCallback(
    async (userId) => {
      await dispatch(usersRedux.actions.unblockUser(userId));
      dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
    },
    [dispatch],
  );
  const fetchUserDetails = useCallback(
    async (userId) => {
      try {
        await dispatch(usersRedux.actions.fetchUserDetails(userId));
        navigate(`${userId}/view-details`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  return (
    <PageContainer title="All Users" breadcrumbs={[{ label: "All Users" }]}>
      <ListUsers
        fetchUsers={fetchUsers}
        exportUsers={exportUsers}
        resetPassword={resetPassword}
        handleSyncUser={handleSyncUser}
        blockUser={blockUser}
        unblockUser={unblockUser}
        fetchUserDetails={fetchUserDetails}
      />
    </PageContainer>
  );
};

export default ListUserPage;
