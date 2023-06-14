import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";

import ListOnboardedOrganisations from "../../../components/templates/storage/objectStorage/ListOnboardedOrganisations";

const ListObjectStorageOnboardedOrganisation = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchOrganisations = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageOnboardedOrganisation(payload));
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
    <PageContainer title="Onboarded Organisations" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Onboarded Organisations" }]}>
      <ListOnboardedOrganisations fetchOrganisations={fetchOrganisations} exportOrganisations={exportOrganisations} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListObjectStorageOnboardedOrganisation;
