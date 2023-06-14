import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ViewSSLCertificateDetail from "components/modals/viewSSLCertificateDetail";
import ListSSLRequests from "components/templates/loadBalancers/ListSSLRequests";

const ListSSLRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchSSLRequests = useCallback(
    (payload) => {
      dispatch(loadBalancersRedux.actions.sslRequests(payload));
    },
    [dispatch],
  );

  const exportSSLRequests = useCallback(async () => {
    try {
      return await dispatch(loadBalancersRedux.actions.exportSSLRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchSSLRequestOwnerDetail = useCallback(
    (item) => {
      dispatch(loadBalancersRedux.actions.computeSSLRequestOwnerDetail({ providerId: item?.provider_id, sslRequestId: item?.id }));
    },
    [dispatch],
  );

  const fetchSslRequestViewCertificateDetail = useCallback(
    (item) => {
      dispatch(loadBalancersRedux.actions.sslRequestViewCertificateDetail({ providerId: item?.provider_id, sslConfigureRequestId: item?.id }));
    },
    [dispatch],
  );

  // const fetchSslViewLbDetail = useCallback(
  //   (item) => {
  //     dispatch(
  //       loadBalancersRedux.actions.loadBalancers({
  //         filters: JSON.stringify({ id: [item?.load_balancer?.id] }),
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );

  return (
    <PageContainer title="SSL Configuration Requests" breadcrumbs={[{ label: "SSL Configuration Requests" }]}>
      <ListSSLRequests
        defaultFilters={defaultFilters}
        fetchSSLRequests={fetchSSLRequests}
        exportSSLRequests={exportSSLRequests}
        fetchSSLRequestOwnerDetail={fetchSSLRequestOwnerDetail}
        fetchSslRequestViewCertificateDetail={fetchSslRequestViewCertificateDetail}
      />
      <ResourseOwnerDetail modalTitle="SSL Request Owner Details" />
      <ViewSSLCertificateDetail modalTitle="SSL Request Certificates" />
    </PageContainer>
  );
};

export default ListSSLRequestPage;
