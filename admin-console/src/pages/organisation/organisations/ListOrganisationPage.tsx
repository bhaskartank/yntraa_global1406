import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOrganisations from "components/templates/organisations/organisations/ListOrganisations";

const ListOrganisationPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchOrganisations = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisations(payload));
    },
    [dispatch],
  );

  const exportOrganisations = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisations());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Organisations List">
      <ListOrganisations fetchOrganisations={fetchOrganisations} exportOrganisations={exportOrganisations} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListOrganisationPage;
