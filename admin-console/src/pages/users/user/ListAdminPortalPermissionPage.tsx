import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import UserDetailBar from "components/molecules/DetailBars/UserDetailBar";
import AssignAdminPortalRoles from "components/templates/users/user/AssignAdminPortalPermission";
import ListAdminPortalPermissions from "components/templates/users/user/ListAdminPortalPermissions";

const ListAdminPortalPermissionPage = () => {
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();
  const { user } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const adminPortalPermissionScopes = usersRedux.getters.adminPortalPermissionScopes(rootState);
  const providers = providersRedux.getters.providers(rootState);

  const fetchAdminPortalPermissions = useCallback(
    (payload) => {
      dispatch(usersRedux.actions.adminPortalPermissions(user?.id, payload));
    },
    [dispatch, user],
  );

  const exportAdminPortalPermissions = useCallback(async () => {
    try {
      return await dispatch(usersRedux.actions.exportAdminPortalPermissions(user?.id));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, user]);

  const assignScope = useCallback(
    async (payload) => {
      try {
        await dispatch(usersRedux.actions.assignAdminPortalPermission(user?.id, payload));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey, user],
  );

  const unassignRole = useCallback(
    async (adminRoleScopeId) => {
      try {
        await dispatch(usersRedux.actions.unassignAdminPortalPermission(user?.id, adminRoleScopeId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey, user],
  );

  useEffect(() => {
    dispatch(usersRedux.actions.adminPortalPermissionScopes({ limit: 100, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer title="Admin Portal Permissions" breadcrumbs={[{ label: "All Users", to: "/users/all-users" }, { label: "Admin Portal Permissions" }]}>
      <UserDetailBar user={user} type="page" />
      <AssignAdminPortalRoles handleAssign={assignScope} providers={providers?.list?.data || []} roles={adminPortalPermissionScopes} />
      <ListAdminPortalPermissions
        fetchAdminPortalPermissions={fetchAdminPortalPermissions}
        exportAdminPortalPermissions={exportAdminPortalPermissions}
        unassignRole={unassignRole}
      />
    </PageContainer>
  );
};

export default ListAdminPortalPermissionPage;
