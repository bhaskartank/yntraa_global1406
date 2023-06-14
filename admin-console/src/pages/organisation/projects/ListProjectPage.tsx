import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListProjects from "components/templates/organisations/projects/ListProjects";

const ListProjectPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchProjects = useCallback(
    (payload) => {
      dispatch(projectsRedux.actions.projects(payload));
    },
    [dispatch],
  );

  const exportProjects = useCallback(async () => {
    try {
      return await dispatch(projectsRedux.actions.exportProjects());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchProjectOwnerDetail = useCallback(
    (item) => {
      dispatch(projectsRedux.actions.computeProjectOwnerDetails({ projectId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Projects" breadcrumbs={[{ label: "Projects" }]}>
      <ListProjects fetchProjects={fetchProjects} exportProjects={exportProjects} fetchProjectOwnerDetail={fetchProjectOwnerDetail} defaultFilters={defaultFilters} />
      <ResourseOwnerDetail modalTitle="Project Owner Details" />
    </PageContainer>
  );
};

export default ListProjectPage;
