import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAdmin from "components/templates/users/admin/ListAdmin";
import ListSSOUsers from "components/templates/users/SSOUser/ListSSOUsers";

const ListSSOUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSSOUsers = useCallback(
    (payload) => {
      dispatch(usersRedux.actions.SSOUsers(payload));
    },
    [dispatch],
  );

  const exportSSOUsers = useCallback(async () => {
    try {
      return await dispatch(usersRedux.actions.exportAdmin());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  
  return (
    <PageContainer title="SSO Users" breadcrumbs={[{ label: "All Users", to: "/users/all-users" }, { label: "SSO Users" }]}>
      <ListSSOUsers fetchSSOUsers={fetchSSOUsers} exportSSOUsers={exportSSOUsers} />
    </PageContainer>
  );
};

export default ListSSOUserPage;
