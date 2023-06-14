import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListSSLCertificatesDetail from "components/templates/loadBalancers/ListSSLCertificatesDetail";

const ListSSLCertificatesDetailsPage = () => {
  const { state } = useLocation();
  const { sslCertificateDetail } = state;

  return (
    <PageContainer
      title="SSL Certificates Details"
      breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "SSL Certificates", to: "/load-balancers/ssl-cert" }, { label: "View Details" }]}>
      {<ListSSLCertificatesDetail requestData={sslCertificateDetail} />}
    </PageContainer>
  );
};

export default ListSSLCertificatesDetailsPage;
