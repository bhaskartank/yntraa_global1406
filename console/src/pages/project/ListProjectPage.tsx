import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";
import projectRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListProject from "components/templates/project/ListProject";

import { pageTitles } from "utils/constants";

const ListProjectPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const projects = projectRedux.getters.projects(rootState);
  const userRoleScope = authRedux.getters.userRoleScope(rootState);

  const fetchProjects = useCallback(
    async (payload) => {
      dispatch(projectRedux.actions.projects(payload));
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_PROJECT}>
      <ListProject list={projects} fetchList={fetchProjects} userRoles={userRoleScope} />
    </PageContainer>
  );
};

export default ListProjectPage;
