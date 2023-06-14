import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrgOnboardingRequestDetailBar from "components/molecules/DetailBars/OrgOnboardingRequestDetailBar";
import ListOrganisationOnboardingRequestUserDetails from "components/templates/organisations/ListRequestUserDetails";

const ListOrganisationOnboardingRequestUserDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { state: routerState } = useLocation();
  const { onboardingRequestDetail } = routerState;

  const rootState = useSelector((state) => state);
  const onboardingRequestUserDetails = organisationsRedux.getters.onboardingRequestUserDetails(rootState);

  useEffect(() => {
    dispatch(organisationsRedux.actions.onboardingRequestUserDetails(requestId));
  }, [dispatch, requestId]);

  const fetchUserDetails = useCallback(
    async (userId) => {
      try {
        await dispatch(usersRedux.actions.fetchUserDetails(userId?.is_existing_user?.user_id));
        navigate(`/organisations/onboard-request/${userId?.is_existing_user?.user_id}/view-details`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const resetPassword = useCallback(
    (userId) => {
      dispatch(usersRedux.actions.resetPassword(userId));
    },
    [dispatch],
  );

  return (
    <PageContainer title="User Details" breadcrumbs={[{ label: "Onboarding Requests", to: "/organisations/onboard-request" }, { label: "User Details" }]}>
      <OrgOnboardingRequestDetailBar data={onboardingRequestDetail} />
      <ListOrganisationOnboardingRequestUserDetails
        users={onboardingRequestUserDetails?.organisation_onboard_request_user || []}
        fetchUserDetails={fetchUserDetails}
        resetPassword={resetPassword}
      />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingRequestUserDetailsPage;
