import { useSelector } from "store";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListUserDetails from "components/templates/users/user/ListUserDetails";

const ListUserDetailsPage = () => {
  const rootState = useSelector((state: any) => state);
  const users = usersRedux.getters.userDetails(rootState);
  // const requestId = rootState?.organisations?.onboardingRequestUserDetails?.organisation_onboard_request?.id;

  return (
    <PageContainer
      title="User Details"
      breadcrumbs={[
        { label: "Onboarding Requests", to: "/organisations/onboard-request" },
        // { label: "User List", to: `/organisations/onboard-request/${requestId}/users` },
        { label: "View Details" },
      ]}>
      {<ListUserDetails requestData={users.list} />}
    </PageContainer>
  );
};

export default ListUserDetailsPage;
