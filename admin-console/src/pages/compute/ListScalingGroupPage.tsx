import { useCallback } from "react";

import { useDispatch } from "store";
import scalingGroupsRedux from "store/modules/scalingGroups";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListScalingGroups from "components/templates/compute/ListScalingGroups";

const ListScalingGroupPage = () => {
  const dispatch = useDispatch();

  const fetchScalingGroups = useCallback(
    (payload) => {
      dispatch(scalingGroupsRedux.actions.scalingGroups(payload));
    },
    [dispatch],
  );

  const exportScalingGroups = useCallback(async () => {
    try {
      return await dispatch(scalingGroupsRedux.actions.exportScalingGroups());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchScalingOwnerDetail = useCallback(
    (item) => {
      dispatch(scalingGroupsRedux.actions.computeScalingOwnerDetails({ providerId: item?.provider_id, scalingGroupId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Scaling Groups" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Scaling Groups" }]}>
      <ListScalingGroups fetchScalingGroups={fetchScalingGroups} exportScalingGroups={exportScalingGroups} fetchScalingOwnerDetail={fetchScalingOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Scaling group Owner Details" />
    </PageContainer>
  );
};

export default ListScalingGroupPage;
