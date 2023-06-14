import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOrganisationOnboardingChangeRequests from "components/templates/organisations/ListOrganisationOnboardingChangeRequests";

const ListOrganisationOnboardingChangeRequestPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchOnboardingChangeRequests = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationOnboardingChangeRequests(payload));
    },
    [dispatch],
  );

  const exportOnboardingChangeRequests = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationOnboardingChangeRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Onboarding Change Requests" breadcrumbs={[{ label: "Onboarding Change Requests" }]}>
      <ListOrganisationOnboardingChangeRequests
        fetchOnboardingChangeRequests={fetchOnboardingChangeRequests}
        exportOnboardingChangeRequests={exportOnboardingChangeRequests}
        defaultFilters={defaultFilters}
      />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingChangeRequestPage;
