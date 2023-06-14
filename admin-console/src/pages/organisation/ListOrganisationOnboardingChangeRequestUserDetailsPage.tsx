import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrgOnboardingRequestDetailBar from "components/molecules/DetailBars/OrgOnboardingRequestDetailBar";
import ListOrganisationOnboardingChangeRequestUserDetails from "components/templates/organisations/ListRequestUserDetails";

const ListOrganisationOnboardingChangeRequestUserDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { state: routerState } = useLocation();
  const { onboardingChangeRequestDetail } = routerState;

  const rootState = useSelector((state) => state);
  const onboardingChangeRequestUserDetails = organisationsRedux.getters.onboardingChangeRequestUserDetails(rootState);

  useEffect(() => {
    dispatch(organisationsRedux.actions.onboardingChangeRequestUserDetails(requestId));
  }, [dispatch, requestId]);

  const fetchUserDetails = useCallback(
    async (userId) => {
      try {
        await dispatch(usersRedux.actions.fetchUserDetails(userId?.is_existing_user?.user_id));
        navigate(`/organisations/change-request/${userId?.is_existing_user?.user_id}/view-details`);
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
    <PageContainer title="User Details" breadcrumbs={[{ label: "Onboarding Change Requests", to: "/organisations/change-request" }, { label: "User Details" }]}>
      <OrgOnboardingRequestDetailBar data={onboardingChangeRequestDetail} />
      <ListOrganisationOnboardingChangeRequestUserDetails users={onboardingChangeRequestUserDetails} fetchUserDetails={fetchUserDetails} resetPassword={resetPassword} />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingChangeRequestUserDetailsPage;
