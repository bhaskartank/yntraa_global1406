import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import ListProjectGatewayServices from "components/templates/organisations/projects/ListProjectGatewayServices";

const ListProjectGatewayServicePage = () => {
  const datalistKey = useCurrentPath();
  const { projectId, providerId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const projectById = projectsRedux.getters.projectById(rootState, projectId);

  const fetchProjectGatewayServices = useCallback(() => {
    dispatch(projectsRedux.actions.projectGatewayServices(providerId, projectId));
  }, [dispatch, providerId, projectId]);

  const updatedProjectGatewayServicesStatus = useCallback(() => {
    dispatch(projectsRedux.actions.updatedProjectGatewayServicesStatus(providerId, projectId));
  }, [dispatch, providerId, projectId]);

  const projectGatewayServiceAction = useCallback(
    async (serviceId, action) => {
      try {
        await dispatch(projectsRedux.actions.projectGatewayServiceAction(providerId, projectId, serviceId, action));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, projectId, datalistKey],
  );

  return (
    <PageContainer
      title="Gateway Services"
      breadcrumbs={[
        { label: "Projects", to: "/organisations/projects" },
        { label: "Provider Mapping", to: `/organisations/projects/${projectById.organisation_id}/${projectId}/providers` },
        { label: "Gateway Services" },
      ]}>
      <ProjectDetailBar project={projectById} />
      <ListProjectGatewayServices
        fetchProjectGatewayServices={fetchProjectGatewayServices}
        updatedProjectGatewayServicesStatus={updatedProjectGatewayServicesStatus}
        projectGatewayServiceAction={projectGatewayServiceAction}
      />
    </PageContainer>
  );
};

export default ListProjectGatewayServicePage;
