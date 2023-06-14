import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrganisationDetailBar from "components/molecules/DetailBars/OrganisationDetailBar";
import ListQuota from "components/templates/organisations/organisations/ListQuota";

const ListQuotaPage = () => {
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisationById = organisationsRedux.getters.organisationById(rootState, organisationId);

  const fetchQuotas = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationQuotas(organisationId, payload));
    },
    [dispatch, organisationId],
  );

  const exportQuotas = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationQuotas(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  return (
    <PageContainer title="Quota" breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Quota" }]}>
      <OrganisationDetailBar organisation={organisationById} />
      <ListQuota fetchQuotas={fetchQuotas} exportQuotas={exportQuotas} />
    </PageContainer>
  );
};

export default ListQuotaPage;
