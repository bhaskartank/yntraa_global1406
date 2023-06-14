import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";
import projectsRedux from "store/modules/projects";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import UserDetailBar from "components/molecules/DetailBars/UserDetailBar";
import AssignServicePortalRoles from "components/templates/users/user/AssignServicePortalPermission";
import ListServicePortalPermissions from "components/templates/users/user/ListServicePortalPermissions";

const ListServicePortalPermissionPage = () => {
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();
  const { user } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const servicePortalPermissionScopes = usersRedux.getters.servicePortalPermissionScopes(rootState);
  const organisations = organisationsRedux.getters.organisations(rootState);
  const projects = projectsRedux.getters.projects(rootState);

  const fetchServicePortalPermissions = useCallback(
    (serviceRoleScopeId) => {
      dispatch(usersRedux.actions.servicePortalPermissions(user?.id, serviceRoleScopeId));
    },
    [dispatch, user],
  );

  const exportServicePortalPermissions = useCallback(async () => {
    try {
      return await dispatch(usersRedux.actions.exportServicePortalPermissions(user?.id));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, user]);

  const assignRole = useCallback(
    async (organisationId, projectId, roleId) => {
      try {
        await dispatch(usersRedux.actions.assignServicePortalPermission(organisationId, projectId, { user_id_list: [user?.id], user_role: roleId }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey, user],
  );

  const fetchProjects = useCallback(
    (payload) => {
      dispatch(projectsRedux.actions.projects(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(usersRedux.actions.servicePortalPermissionScopes({ limit: 100, offset: 0 }));
    dispatch(organisationsRedux.actions.organisations());
  }, [dispatch]);

  return (
    <PageContainer title="Service Portal Permissions" breadcrumbs={[{ label: "All Users", to: "/users/all-users" }, { label: "Service Portal Permissions" }]}>
      <UserDetailBar user={user} type="page" />
      <AssignServicePortalRoles
        handleAssign={assignRole}
        organisations={organisations?.list?.data || []}
        roles={servicePortalPermissionScopes}
        fetchProject={fetchProjects}
        projects={projects?.list?.data || []}
      />

      <ListServicePortalPermissions fetchServicePortalPermissions={fetchServicePortalPermissions} exportServicePortalPermissions={exportServicePortalPermissions} />
    </PageContainer>
  );
};

export default ListServicePortalPermissionPage;
