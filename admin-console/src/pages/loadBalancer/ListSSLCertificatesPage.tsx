import { useCallback } from "react";

import { useDispatch } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ViewSSLCertificateById from "components/modals/ViewSSLCertificateById";
import ListSSLRequests from "components/templates/loadBalancers/ListSSLCertificates";

const ListSSLCertificatesPage = () => {
  const dispatch = useDispatch();

  const fetchSSLCertificates = useCallback(
    (payload) => {
      dispatch(loadBalancersRedux.actions.sslCertificates(payload));
    },
    [dispatch],
  );

  const exportSSLCertificates = useCallback(async () => {
    try {
      return await dispatch(loadBalancersRedux.actions.exportSSLCertificates());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchLbSslCertificatesById = useCallback(
    (payload) => {
      dispatch(loadBalancersRedux.actions.fetchLbSslCertificatesById({ certificateId: payload?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="SSL Certificates" breadcrumbs={[{ label: "SSL Certificates" }]}>
      <ListSSLRequests fetchLbSslCertificatesById={fetchLbSslCertificatesById} fetchSSLCertificates={fetchSSLCertificates} exportSSLCertificates={exportSSLCertificates} />
      <ViewSSLCertificateById modalTitle="SSL Certificates" />
    </PageContainer>
  );
};

export default ListSSLCertificatesPage;
