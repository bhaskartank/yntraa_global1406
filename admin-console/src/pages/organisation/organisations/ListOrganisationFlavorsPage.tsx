import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrganisationDetailBar from "components/molecules/DetailBars/OrganisationDetailBar";
import ListFlavors from "components/templates/organisations/organisations/ListFlavors";

const ListFlavorPage = () => {
  const datalistKey = useCurrentPath();
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisationById = organisationsRedux.getters.organisationById(rootState, organisationId);

  const fetchFlavors = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationFlavors(organisationId, payload));
    },
    [dispatch, organisationId],
  );

  const exportFlavors = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationFlavors(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  const deleteFlavorOrgMapping = useCallback(
    async (payload) => {
      try {
        await dispatch(organisationsRedux.actions.deleteFlavorOrgMapping(organisationId, payload.provider_id, payload.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [datalistKey, dispatch, organisationId],
  );

  return (
    <PageContainer title="Flavors" breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Flavors" }]}>
      <OrganisationDetailBar organisation={organisationById} />
      <ListFlavors fetchFlavors={fetchFlavors} exportFlavors={exportFlavors} deleteFlavorOrgMapping={deleteFlavorOrgMapping} />
    </PageContainer>
  );
};

export default ListFlavorPage;
