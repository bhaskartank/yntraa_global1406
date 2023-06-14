import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAdmin from "components/templates/users/admin/ListAdmin";

const ListAdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAdmin = useCallback(
    (payload) => {
      dispatch(usersRedux.actions.admin(payload));
    },
    [dispatch],
  );

  const exportAdmin = useCallback(async () => {
    try {
      return await dispatch(usersRedux.actions.exportAdmin());
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
    <PageContainer title="Admin Users" breadcrumbs={[{ label: "All Users", to: "/users/all-users" }, { label: "Admin Users" }]}>
      <ListAdmin fetchAdmin={fetchAdmin} exportAdmin={exportAdmin} resetPassword={resetPassword} fetchUserDetails={fetchUserDetails} />
    </PageContainer>
  );
};

export default ListAdminPage;
