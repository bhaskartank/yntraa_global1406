import { useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import QuotaDetailBar from "components/molecules/DetailBars/QuotaDetailBar";
import ListQuotaTopups from "components/templates/organisations/organisations/ListQuotaTopup";

const ListQuotaTopupPage = () => {
  const { organisationId } = useParams();
  const { state: routerState } = useLocation();
  const { quota } = routerState;

  const dispatch = useDispatch();

  const fetchQuotaTopups = useCallback(() => {
    dispatch(organisationsRedux.actions.organisationQuotaTopups(organisationId, quota?.provider_id));
  }, [dispatch, organisationId, quota]);

  return (
    <PageContainer
      title="Quota Topups"
      breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Quota", to: `/organisations/${organisationId}/quota` }, { label: "Quota Topups" }]}>
      <QuotaDetailBar quota={quota} />
      <ListQuotaTopups fetchQuotaTopups={fetchQuotaTopups} />
    </PageContainer>
  );
};

export default ListQuotaTopupPage;
