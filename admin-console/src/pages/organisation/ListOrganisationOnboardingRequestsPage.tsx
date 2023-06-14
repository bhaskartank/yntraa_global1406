import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOrganisationOnboardingRequests from "components/templates/organisations/ListOrganisationOnboardingRequests";

const ListOrganisationOnboardingRequestPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchOnboardingRequests = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationOnboardingRequests(payload));
    },
    [dispatch],
  );

  const exportOnboardingRequests = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationOnboardingRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Organisation Onboarding Requests" breadcrumbs={[{ label: "Organisation Onboarding Requests" }]}>
      <ListOrganisationOnboardingRequests fetchOnboardingRequests={fetchOnboardingRequests} exportOnboardingRequests={exportOnboardingRequests} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingRequestPage;
