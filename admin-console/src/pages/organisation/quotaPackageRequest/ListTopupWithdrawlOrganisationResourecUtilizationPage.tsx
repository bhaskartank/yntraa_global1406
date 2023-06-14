import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import QuotaDetailBar from "components/molecules/DetailBars/QuotaDetailBar";
import ListResources from "components/templates/organisations/organisations/ListResources";
import SelectResourceTypePanel from "components/templates/organisations/organisations/SelectResourceTypePanel";

const ListTopupWithdrawlOrganisationResourecUtilizationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const datalistKey = useCurrentPath();
  const { state } = useLocation();
  const { organisationId } = useParams();
  const { state: routerState } = useLocation();
  const { quotaPackageRequestDetail } = routerState;

  const [selectedResource, setSelectedResource] = useState<any>("false");

  const fetchResources = useCallback(() => {
    dispatch(
      organisationsRedux.actions.organisationResources(quotaPackageRequestDetail?.organisation_id, quotaPackageRequestDetail?.provider_id, {
        with_internal: selectedResource === "true",
      }),
    );
  }, [dispatch, organisationId, selectedResource, quotaPackageRequestDetail]);

  const handleFetchList = useCallback(() => {
    dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: false }));
  }, [dispatch, datalistKey]);

  useEffect(() => {
    fetchResources();
  }, [selectedResource, fetchResources]);

  return (
    <PageContainer
      title="Organisation Resource Utilization Details"
      breadcrumbs={[{ label: "Organisation", to: "/organisations" }, { label: "Quota Topup Withdraw Requests", to: "/organisations/quota-withdraw" }, { label: "Resources" }]}>
      <QuotaDetailBar quota={quotaPackageRequestDetail} />
      <SelectResourceTypePanel handleFetch={handleFetchList} selectedResource={selectedResource} handleSelectResource={setSelectedResource} />
      <ListResources fetchResources={fetchResources} />
    </PageContainer>
  );
};

export default ListTopupWithdrawlOrganisationResourecUtilizationPage;
