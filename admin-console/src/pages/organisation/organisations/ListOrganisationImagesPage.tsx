import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrganisationDetailBar from "components/molecules/DetailBars/OrganisationDetailBar";
import ListImages from "components/templates/organisations/organisations/ListImages";

const ListImagePage = () => {
  const datalistKey = useCurrentPath();
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisationById = organisationsRedux.getters.organisationById(rootState, organisationId);

  const fetchImages = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationImages(organisationId, payload));
    },
    [dispatch, organisationId],
  );

  const exportImages = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationImages(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  const deleteImageOrgMapping = useCallback(
    async (payload) => {
      try {
        await dispatch(organisationsRedux.actions.deleteImageOrgMapping(organisationId, payload.provider_id, payload.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [datalistKey, dispatch, organisationId],
  );

  return (
    <PageContainer title="Images" breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Images" }]}>
      <OrganisationDetailBar organisation={organisationById} />
      <ListImages fetchImages={fetchImages} exportImages={exportImages} deleteImageOrgMapping={deleteImageOrgMapping} />
    </PageContainer>
  );
};

export default ListImagePage;
