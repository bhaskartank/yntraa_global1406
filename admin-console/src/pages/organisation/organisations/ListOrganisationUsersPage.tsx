import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrganisationDetailBar from "components/molecules/DetailBars/OrganisationDetailBar";
import ListUsers from "components/templates/organisations/organisations/ListUsers";

const ListUserPage = () => {
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisationById = organisationsRedux.getters.organisationById(rootState, organisationId);

  const fetchUsers = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationUsers(organisationId, payload));
    },
    [dispatch, organisationId],
  );

  const exportUsers = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationUsers(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  return (
    <PageContainer title="Users" breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Users" }]}>
      <OrganisationDetailBar organisation={organisationById} />
      <ListUsers fetchUsers={fetchUsers} exportUsers={exportUsers} />
    </PageContainer>
  );
};

export default ListUserPage;
