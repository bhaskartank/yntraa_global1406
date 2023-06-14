import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListPublicIPPool from "components/templates/networks/ListPublicIPPool";

const ListPublicIPPoolPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPublicIPs = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.publicIPs(payload));
    },
    [dispatch],
  );

  const exportPublicIPs = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportPublicIPs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const deletePublicIP = useCallback(
    (item) => {
      dispatch(networksRedux.actions.deletePublicIP({ providerId: item?.provider_id, publicIpId: item?.id }));
      navigate("/networks/public-ip-pools");
    },
    [dispatch, navigate],
  );

  return (
    <PageContainer title="Public IP Pools" breadcrumbs={[{ label: "Public IP Pools" }]}>
      <ListPublicIPPool fetchPublicIPs={fetchPublicIPs} exportPublicIPs={exportPublicIPs} deletePublicIP={deletePublicIP} />
    </PageContainer>
  );
};

export default ListPublicIPPoolPage;
