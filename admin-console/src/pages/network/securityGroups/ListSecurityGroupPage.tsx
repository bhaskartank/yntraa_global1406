import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourceOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListSecurityGroups from "components/templates/compute/ListSecurityGroups";

const ListSecurityGroupPage = () => {
  const dispatch = useDispatch();

  const fetchSecurityGroups = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.securityGroups(payload));
    },
    [dispatch],
  );

  const exportSecurityGroups = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportSecurityGroups());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchSecurityGroupOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computeSecurityGroupOwnerDetails({ providerId: item?.provider_id, securityGroupId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Security Groups" breadcrumbs={[{ label: "Security Groups" }]}>
      <ListSecurityGroups fetchSecurityGroups={fetchSecurityGroups} exportSecurityGroups={exportSecurityGroups} fetchSecurityGroupOwnerDetail={fetchSecurityGroupOwnerDetail} />
      <ResourceOwnerDetail modalTitle="Security Group Owner Details" />
    </PageContainer>
  );
};

export default ListSecurityGroupPage;
