import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import QuotaDetailBar from "components/molecules/DetailBars/QuotaDetailBar";
import ListResources from "components/templates/organisations/organisations/ListResources";
import SelectResourceTypePanel from "components/templates/organisations/organisations/SelectResourceTypePanel";

const ListResourcePage = () => {
  const datalistKey = useCurrentPath();
  const { organisationId } = useParams();
  const { state: routerState } = useLocation();
  const { quota } = routerState;

  const dispatch = useDispatch();

  const [selectedResource, setSelectedResource] = useState<any>("false");

  const fetchResources = useCallback(() => {
    dispatch(organisationsRedux.actions.organisationResources(organisationId, quota?.provider_id, { with_internal: selectedResource === "true" }));
  }, [dispatch, organisationId, selectedResource, quota]);

  const handleFetchList = useCallback(() => {
    dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: false }));
  }, [dispatch, datalistKey]);

  useEffect(() => {
    fetchResources();
  }, [selectedResource, fetchResources]);

  return (
    <PageContainer
      title="Resources"
      breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Quota", to: `/organisations/${organisationId}/quota` }, { label: "Resources" }]}>
      <QuotaDetailBar quota={quota} />
      <SelectResourceTypePanel handleFetch={handleFetchList} selectedResource={selectedResource} handleSelectResource={setSelectedResource} />
      <ListResources fetchResources={fetchResources} />
    </PageContainer>
  );
};

export default ListResourcePage;
