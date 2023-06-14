import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import projectsRedux from "store/modules/projects";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import AttachUserPanels from "components/templates/organisations/projects/AttachUserPanel";
import ListProjectUsers from "components/templates/organisations/projects/ListProjectUsers";

const ListProjectUsersPage = () => {
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();
  const { project } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const users = usersRedux.getters.users(rootState);
  const roles = usersRedux.getters.roles(rootState);
  const projectById = projectsRedux.getters.projectById(rootState, project?.id);

  const fetchProjectUsers = useCallback(
    (payload) => {
      dispatch(projectsRedux.actions.projectUsers(project?.organisation_id, project?.id, payload));
    },
    [dispatch, project],
  );

  const exportProjectUsers = useCallback(() => {
    dispatch(projectsRedux.actions.exportProjectUsers(project?.organisation_id, project?.id));
  }, [dispatch, project]);

  const attachUser = useCallback(
    async (userId, role) => {
      try {
        await dispatch(projectsRedux.actions.attachUser(project?.organisation_id, project?.id, { user_id_list: [userId], user_role: role }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, project, datalistKey],
  );

  const detachUser = useCallback(
    async (userId) => {
      try {
        await dispatch(projectsRedux.actions.detachUser(project?.organisation_id, project?.id, { user_id_list: [userId] }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, project, datalistKey],
  );

  useEffect(() => {
    dispatch(usersRedux.actions.users());
    dispatch(usersRedux.actions.roles({ limit: 100, role_type: "System" }));
  }, [dispatch]);

  return (
    <PageContainer title="Users" breadcrumbs={[{ label: "Projects", to: "/organisations/projects" }, { label: "Users" }]}>
      <ProjectDetailBar project={projectById} />
      <AttachUserPanels handleAttach={attachUser} users={users?.list?.data || []} roles={roles?.list || []} />
      <ListProjectUsers fetchProjectUsers={fetchProjectUsers} exportProjectUsers={exportProjectUsers} detachUser={detachUser} />
    </PageContainer>
  );
};

export default ListProjectUsersPage;
