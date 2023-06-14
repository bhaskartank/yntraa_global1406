import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import confirmModalRedux from "store/modules/confirmModal";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";
import usersRedux from "store/modules/users";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateOrganisationOnboardingRequest from "components/templates/organisations/CreateOrganisationOnboardingRequest";

const CreateOrganisationOnboardingRequestPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const users = usersRedux.getters.users(rootState);
  const providers = providersRedux.getters.providers(rootState);
  const availableBaseQuota = providersRedux.getters.availableBaseQuota(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        dispatch(
          confirmModalRedux.actions.open({
            title: "Create Organisation Onboarding Request",
            description: "Are you sure you want to create organisation onboarding request?",
            onConfirm: async () => {
              await dispatch(organisationsRedux.actions.createOrganisationOnboardingRequest(payload));
              navigate("/organisations/onboard-request");
            },
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const fetchUsers = useCallback(() => {
    dispatch(usersRedux.actions.users());
  }, [dispatch]);

  const fetchQuotaPackages = useCallback(
    (providerId) => {
      dispatch(providersRedux.actions.availableBaseQuota({ filters: JSON.stringify({ provider_id: [providerId], is_active: ["true"] }) }));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Organisation Onboarding Requests"
      breadcrumbs={[{ label: "Organisation Onboarding Requests", to: "/organisations/onboard-request" }, { label: "Create" }]}>
      <CreateOrganisationOnboardingRequest
        handleCreate={handleCreate}
        users={users?.list?.data || []}
        quotaPackages={availableBaseQuota?.list?.data || []}
        providers={providers?.list?.data || []}
        fetchQuotaPackages={fetchQuotaPackages}
      />
    </PageContainer>
  );
};

export default CreateOrganisationOnboardingRequestPage;
