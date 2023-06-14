import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListFloatingIPs from "components/templates/networks/ListFloatingIPs";

const ListFloatingIPPage = () => {
  const dispatch = useDispatch();

  const fetchFloatingIPs = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.floatingIPs(payload));
    },
    [dispatch],
  );

  const exportFloatingIPs = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportFloatingIPs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchFloatingIpOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computeFloatingIpOwnerDetails({ providerId: item?.provider_id, floatingIpId: item?.id }));
    },
    [dispatch],
  );

  const releaseFloatingIP = useCallback(
    (item) => {
      dispatch(networksRedux.actions.releaseFloatingIP({ providerId: item?.provider_id, projectId: item?.project_id, floatingIpId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Floating IPs" breadcrumbs={[{ label: "Floating IPs" }]}>
      <ListFloatingIPs
        fetchFloatingIPs={fetchFloatingIPs}
        exportFloatingIPs={exportFloatingIPs}
        fetchFloatingIpOwnerDetail={fetchFloatingIpOwnerDetail}
        releaseFloatingIP={releaseFloatingIP}
      />
      <ResourseOwnerDetail modalTitle="FloatingIp Owner Details" />
    </PageContainer>
  );
};

export default ListFloatingIPPage;
