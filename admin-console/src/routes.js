import useIsInternalType from "hooks/useIsInternalType";
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

import LoadingScreen from "components/atoms/loaders/SuspenseLoader/LoadingScreen";
import { DashboardLayout } from "components/layouts/DashboardLayout";
import AuthGuard from "components/layouts/Guards/Auth";

const Loadable = (Component) => (myProps) => {
  return <Suspense fallback={<LoadingScreen />}>{myProps?.hidden?.() ? <></> : <Component {...myProps} />}</Suspense>;
};

// LoginPage
const LoginPage = Loadable(lazy(() => import("pages/LoginPage")));

// ForgotPasswordPage
const ForgotPasswordPage = Loadable(lazy(() => import("pages/ForgotPasswordPage")));

// Organisations
const ListOrganisationPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationPage")));
const ListOrganisationDetailsPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationDetailsPage")));
const ListOrganisationUsersPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationUsersPage")));
const ListOrganisationResourcesPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationResourcesPage")));
const ListQuotaRequestOrganisationResourecUtilizationPage = Loadable(
  lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaRequestOrganisationResourecUtilizationPage")),
);
const ListQuotaTopupOrganisationResourecUtilizationPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaTopupOrganisationResourecUtilizationPage")));
const ListTopupWithdrawlOrganisationResourecUtilizationPage = Loadable(
  lazy(() => import("pages/organisation/quotaPackageRequest/ListTopupWithdrawlOrganisationResourecUtilizationPage")),
);
const ListOrganisationQuotaPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationQuotaPage")));
const ListOrganisationQuotaTopupPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationQuotaTopupPage")));
const ListOrganisationImagesPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationImagesPage")));
const ListOrganisationFlavorsPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationFlavorsPage")));
const ListOrganisationZonesPage = Loadable(lazy(() => import("pages/organisation/organisations/ListOrganisationZonesPage")));
const ListOrganisationOnboardingRequestsPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingRequestsPage")));
const CreateOrganisationOnboardingRequestsPage = Loadable(lazy(() => import("pages/organisation/CreateOrganisationOnboardingRequestsPage")));
const ListOrganisationOnboardingRequestDetailsPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingRequestDetailsPage")));
const ListOrganisationOnboardingChangeRequestDetailsPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingChangeRequestDetailsPage")));
const ListOrganisationOnboardingRequestUserDetailsPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingRequestUserDetailsPage")));
const ListOrganisationOnboardingChangeRequestPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingChangeRequestPage")));
const ListOrganisationOnboardingChangeRequestUserDetailsPage = Loadable(lazy(() => import("pages/organisation/ListOrganisationOnboardingChangeRequestUserDetailsPage")));
const ListProjectPage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectPage")));
const ListProjectDetailsPage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectDetailsPage")));
const ListProjectGatewayServicePage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectGatewayServicePage")));
const CreateProjectGatewayServicePage = Loadable(lazy(() => import("pages/organisation/projects/CreateProjectGatewayServicePage")));
const ListProjectUsersPage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectUsersPage")));
const ListProjectProviderMappingPage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectProviderMappingPage")));
const ListProjectResourcesPage = Loadable(lazy(() => import("pages/organisation/projects/ListProjectResourcesPage")));
const CreateSecurityGroupByTypePage = Loadable(lazy(() => import("pages/organisation/projects/CreateSecurityGroupByTypePage")));
const ApplyDefaultRuleWithProjectPage = Loadable(lazy(() => import("pages/organisation/projects/ApplyDefaultRuleWithProjectPage")));
const ListQuotaPackageRequestPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaPackageRequestPage")));
const ListQuotaPackageRequestDetailsPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaPackageRequestDetailsPage")));
const ListTopupQuotaRequestPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListTopupQuotaRequestPage")));
const ListQuotaTopupRequestDetailsPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaTopupRequestDetailsPage")));
const ListTopupWithdrawalRequestPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListTopupWithdrawalRequestPage")));
const ListQuotaWithdrawRequestDetailsPage = Loadable(lazy(() => import("pages/organisation/quotaPackageRequest/ListQuotaWithdrawRequestDetailsPage")));
const ListOrgUserDetailsPage = Loadable(lazy(() => import("pages/organisation/ListOrgUserDetailsPage")));

// Compute
const ListVirtualMachinePage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListVirtualMachinePage")));
const VirtualMachineDetailPage = Loadable(lazy(() => import("pages/compute/virtualMachine/VirtualMachineDetailPage")));
const ListComputeAttachedSnapshotsPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeAttachedSnapshotsPage")));
const ListComputeAttachedVolumesPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeAttachedVolumesPage")));
const ListComputeAttachedSGPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeAttachedSGPage")));
const ListComputeAttachedNetworksPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeAttachedNetworksPage")));
const ListComputeEventLogsPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeEventLogsPage")));
const ComputeConsolePage = Loadable(lazy(() => import("pages/compute/virtualMachine/ComputeConsolePage")));
const ComputeConsoleLogsPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ComputeConsoleLogsPage")));
const ListScalingGroupPage = Loadable(lazy(() => import("pages/compute/ListScalingGroupPage")));
const ListComputeSnapshotPage = Loadable(lazy(() => import("pages/compute/ListComputeSnapshotPage")));
const ComputeSnapshotDetailPage = Loadable(lazy(() => import("pages/compute/ComputeSnapshotDetailPage")));

// Storage
const ListBlockStoragePage = Loadable(lazy(() => import("pages/storage/ListBlockStoragePage")));
const ListVolumeAttachedComputePage = Loadable(lazy(() => import("pages/storage/ListVolumeAttachedComputePage")));
const ListVolumeSnapshotPage = Loadable(lazy(() => import("pages/storage/ListVolumeSnapshotPage")));
const ListObjectStorageOnboardingRequestsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageOnboardingRequestsPage")));
const ListObjectStorageOnboardedOrganisation = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageOnboardedOrganisation")));
const ListOSProviderAttachedQuotaPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListOSProviderAttachedQuotaPage")));
const ObjectStorageOnboardedOrganisationDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ObjectStorageOnboardedOrganisationDetailsPage")));
const ListObjectStorageQuotaDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageQuotaDetailsPage")));
const ListObjectStorageOnboardingRequestDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageOnboardingRequestDetailsPage")));
const ListObjectStorageBucketsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageBucketsPage")));
const ListObjectStorageQuotaTopupPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageQuotaTopupPage")));
const ListObjectStorageBucketsDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageBucketsDetailsPage")));
const ListObjectStorageProvidersPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageProvidersPage")));
const ListObjectStorageProvidersDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageProvidersDetailsPage")));
const ListObjectStorageQuotaPackagePage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageQuotaPackagePage")));
const ListObjectStorageResourceTopupRequestPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageResourceTopupRequestPage")));
const ListObjectStorageResourceTopupWithdrawPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageResourceTopupWithdrawPage")));
const ListObjectStorageResourceTopupWithdrawlRequestDetailsPage = Loadable(
  lazy(() => import("pages/storage/objectStorage/ListObjectStorageResourceTopupWithdrawlRequestDetailsPage")),
);
const ListObjectStorageResourceTopupRequestDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageResourceTopupRequestDetailsPage")));
const ListObjectStorageQuotaPackageDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageQuotaPackageDetailsPage")));
const ListObjectStorageActionLogsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageActionLogsPage")));
const ListObjectStorageActionLogsDetailsPage = Loadable(lazy(() => import("pages/storage/objectStorage/ListObjectStorageActionLogsDetailsPage")));

// Network
const ListNetworkPage = Loadable(lazy(() => import("pages/network/ListNetworkPage")));
const ListRouterPage = Loadable(lazy(() => import("pages/network/router/ListRouterPage")));
const ListSecurityGroupPage = Loadable(lazy(() => import("pages/network/securityGroups/ListSecurityGroupPage")));
const ListSGRulesPage = Loadable(lazy(() => import("pages/compute/virtualMachine/ListComputeSGRulePage")));
const ListSecurityGroupRulesPage = Loadable(lazy(() => import("pages/network/securityGroups/ListSecurityGroupRulesPage")));
const CreateSecurityGroupRulesPage = Loadable(lazy(() => import("pages/network/securityGroups/CreateSecurityGroupRulesPage")));
const SyncSecurityGroupRulesPage = Loadable(lazy(() => import("pages/network/securityGroups/SyncSecurityGroupRulesPage")));
// const ListSGRulesPage = Loadable(lazy(() => import("pages/network/securityGroups/ListSGRulesPage")));
const ListFloatingIPPage = Loadable(lazy(() => import("pages/network/ListFloatingIPPage")));
const ReserveFloatingIPPage = Loadable(lazy(() => import("pages/network/ReserveFloatingIPPage")));
const ListPublicIPPoolPage = Loadable(lazy(() => import("pages/network/publicIP/ListPublicIPPoolPage")));
const ImportPublicIPPoolPage = Loadable(lazy(() => import("pages/network/publicIP/ImportPublicIPPoolPage")));
const DeletePublicIPPoolPage = Loadable(lazy(() => import("pages/network/publicIP/DeletePublicIPPoolPage")));
const UpdatePublicIPPage = Loadable(lazy(() => import("pages/network/publicIP/UpdatePublicIPPage")));
const ListRequestedPublicIPPage = Loadable(lazy(() => import("pages/network/publicIP/ListRequestedPublicIPPage")));
const ListRequestedPublicIPDetailsPage = Loadable(lazy(() => import("pages/network/publicIP/ListRequestedPublicIPDetailsPage")));
const ListPublicIPWithdrawalRequestPage = Loadable(lazy(() => import("pages/network/publicIP/ListPublicIPWithdrawalRequestPage")));
const ListPublicIPWithdrawalRequestDetailsPage = Loadable(lazy(() => import("pages/network/publicIP/ListPublicIPWithdrawalRequestDetailsPage")));
const ListPublicIPUpdateRequestPage = Loadable(lazy(() => import("pages/network/publicIP/ListPublicIPUpdateRequestPage")));
const ListPublicIPUpdateRequestDetailsPage = Loadable(lazy(() => import("pages/network/publicIP/ListPublicIPUpdateRequestDetailsPage")));
const ListRouterNetworkDetailsPage = Loadable(lazy(() => import("pages/network/router/ListRouterNetworkDetailsPage")));

// Backup
const ListBackupPage = Loadable(lazy(() => import("pages/backup/ListBackupPage")));
const ListBackupDetailsPage = Loadable(lazy(() => import("pages/backup/ListBackupDetailsPage")));
const ListProtectionGroupPolicyPage = Loadable(lazy(() => import("pages/backup/ListProtectionGroupPolicyPage")));
const ListProtectionGroupPolicyDetailsPage = Loadable(lazy(() => import("pages/backup/ListProtectionGroupPolicyDetailsPage")));
const ListBackupPublicIpPage = Loadable(lazy(() => import("pages/backup/ListBackupPublicIpPage")));
const ListBackupPublicIpDetailsPage = Loadable(lazy(() => import("pages/backup/ListBackupPublicIpDetailsPage")));
const ListBackupPublicIpUpdatePage = Loadable(lazy(() => import("pages/backup/ListBackupPublicIpUpdatePage")));
const ListBackupPublicIpUpdateDetailsPage = Loadable(lazy(() => import("pages/backup/ListBackupPublicIpUpdateDetailsPage")));

// Load Balancer
const ListLoadBalancerPage = Loadable(lazy(() => import("pages/loadBalancer/ListLoadBalancerPage")));
const ListLoadBalancerDetailsPage = Loadable(lazy(() => import("pages/loadBalancer/ListLoadBalancerDetailsPage")));
const ListLBAppliedConfigPage = Loadable(lazy(() => import("pages/loadBalancer/ListLBAppliedConfigPage")));
const ListSSLRequestPage = Loadable(lazy(() => import("pages/loadBalancer/ListSSLRequestPage")));
const ListSSLRequestDetailsPage = Loadable(lazy(() => import("pages/loadBalancer/ListSSLRequestDetailsPage")));
const ListSSLCertificatesPage = Loadable(lazy(() => import("pages/loadBalancer/ListSSLCertificatesPage")));
const ListSSLCertificatesDetailsPage = Loadable(lazy(() => import("pages/loadBalancer/ListSSLCertificatesDetailsPage")));
const ListLBLogsPage = Loadable(lazy(() => import("pages/loadBalancer/ListLBLogsPage")));
const ListLBConfigTemplatePage = Loadable(lazy(() => import("pages/loadBalancer/ListLBConfigTemplatePage")));

// Provider
const ListProviderPage = Loadable(lazy(() => import("pages/provider/providers/ListProviderPage")));
const ListProviderDetailsPage = Loadable(lazy(() => import("pages/provider/providers/ListProviderDetailsPage")));
const CreateProviderPage = Loadable(lazy(() => import("pages/provider/providers/CreateProviderPage")));
const ListAttachedQuotaPage = Loadable(lazy(() => import("pages/provider/providers/ListAttachedQuotaPage")));
const ListResourceTopupPage = Loadable(lazy(() => import("pages/provider/providers/ListResourceTopupPage")));
const ListServiceProviderPage = Loadable(lazy(() => import("pages/provider/providers/serviceProviders/ListServiceProviderPage")));
const CreateServiceProviderPage = Loadable(lazy(() => import("pages/provider/providers/serviceProviders/CreateServiceProviderPage")));
const UpdateServiceProviderPage = Loadable(lazy(() => import("pages/provider/providers/serviceProviders/UpdateServiceProviderPage")));
const ListProviderResourceMappingPage = Loadable(lazy(() => import("pages/provider/providers/resourceMapping/ListProviderResourceMappingPage")));
const CreateProviderResourceMappingPage = Loadable(lazy(() => import("pages/provider/providers/resourceMapping/CreateProviderResourceMappingPage")));
const ListImagePage = Loadable(lazy(() => import("pages/provider/images/ListImagePage")));
const UpdateImagePage = Loadable(lazy(() => import("pages/provider/images/UpdateImagePage")));
const ImageOrganisationMappingPage = Loadable(lazy(() => import("pages/provider/images/ImageOrganisationMappingPage")));
const ListImageResourceMappingPage = Loadable(lazy(() => import("pages/provider/images/ListImageResourceMappingPage")));
const ManageImageInitScriptPage = Loadable(lazy(() => import("pages/provider/images/ManageImageInitScriptPage")));
const ListInitScriptHistoryPage = Loadable(lazy(() => import("pages/provider/images/ListInitScriptHistoryPage")));
const InitScriptHistoryDetailPage = Loadable(lazy(() => import("pages/provider/images/InitScriptHistoryDetailPage")));
const ListFlavorPage = Loadable(lazy(() => import("pages/provider/flavors/ListFlavorPage")));
const CreateFlavorPage = Loadable(lazy(() => import("pages/provider/flavors/CreateFlavorPage")));
const UpdateFlavorPage = Loadable(lazy(() => import("pages/provider/flavors/UpdateFlavorPage")));
const FlavorOrganisationMappingPage = Loadable(lazy(() => import("pages/provider/flavors/FlavorOrganisationMappingPage")));
const ListAvailabilityZonePage = Loadable(lazy(() => import("pages/provider/availabilityZone/ListAvailabilityZonePage")));
const UpdateAvailabilityZonePage = Loadable(lazy(() => import("pages/provider/availabilityZone/UpdateAvailabilityZonePage")));
const ZoneOrganisationMappingPage = Loadable(lazy(() => import("pages/provider/availabilityZone/ZoneOrganisationMappingPage")));
const ListDefaultRulePage = Loadable(lazy(() => import("pages/provider/defaultRules/ListDefaultRulePage")));
const CreateDefaultRulePage = Loadable(lazy(() => import("pages/provider/defaultRules/CreateDefaultRulePage")));
const DefaultRuleProjectMappingPage = Loadable(lazy(() => import("pages/provider/defaultRules/DefaultRuleProjectMappingPage")));
const ApplyDefaultRuleOnProjectPage = Loadable(lazy(() => import("pages/provider/defaultRules/ApplyDefaultRuleOnProjectPage")));
const ListResourceMetricPage = Loadable(lazy(() => import("pages/provider/resourceMetrics/ListResourceMetricPage")));
const CreateResourceMetricPage = Loadable(lazy(() => import("pages/provider/resourceMetrics/CreateResourceMetricPage")));
const UpdateResourceMetricPage = Loadable(lazy(() => import("pages/provider/resourceMetrics/UpdateResourceMetricPage")));
const ListHypervisorPage = Loadable(lazy(() => import("pages/provider/ListHypervisorPage")));
const ListOpenstackNetworkPage = Loadable(lazy(() => import("pages/provider/openstackNetwork/ListOpenstackNetworkPage")));
const ListOpenstackSubnetPage = Loadable(lazy(() => import("pages/provider/openstackNetwork/ListOpenstackSubnetPage")));
const ListOpenstackPortPage = Loadable(lazy(() => import("pages/provider/openstackNetwork/ListOpenstackPortPage")));
const ListOpenstackFloatingIPPage = Loadable(lazy(() => import("pages/provider/openstackNetwork/ListOpenstackFloatingIPPage")));
const ListAvailableBaseQuotaPage = Loadable(lazy(() => import("pages/provider/availableQuotaPackage/baseQuota/ListAvailableBaseQuotaPage")));
const ListAvailableBaseQuotaMappedOrganisationPage = Loadable(lazy(() => import("pages/provider/availableQuotaPackage/baseQuota/ListMappedOrganisationPage")));
const ListAvailableTopupQuotaPage = Loadable(lazy(() => import("pages/provider/availableQuotaPackage/ListAvailableTopupQuotaPage")));
const ListMasterBaseQuotaPage = Loadable(lazy(() => import("pages/provider/masterQuotaPackage/baseQuota/ListMasterBaseQuotaPage")));
const ListMasterBaseQuotaMappedOrganisationPage = Loadable(lazy(() => import("pages/provider/masterQuotaPackage/baseQuota/ListMappedOrganisationPage")));
const ListMasterBaseQuotaMappedProvidersPage = Loadable(lazy(() => import("pages/provider/masterQuotaPackage/baseQuota/ListMappedProvidersPage")));
const ListMasterTopupQuotaPage = Loadable(lazy(() => import("pages/provider/masterQuotaPackage/ListMasterTopupQuotaPage")));

// Users
const ListUserPage = Loadable(lazy(() => import("pages/users/user/ListUserPage")));
const CreateUserPage = Loadable(lazy(() => import("pages/users/user/CreateUserPage")));
const ListAdminPortalPermissionPage = Loadable(lazy(() => import("pages/users/user/ListAdminPortalPermissionPage")));
const ListServicePortalPermissionPage = Loadable(lazy(() => import("pages/users/user/ListServicePortalPermissionPage")));
const ListAdminPage = Loadable(lazy(() => import("pages/users/admin/ListAdminPage")));
const ListSSOUserPage = Loadable(lazy(() => import("pages/users/SSOUser/ListSSOUserPage")));
const ListUserDetailsPage = Loadable(lazy(() => import("pages/users/user/ListUserDetailsPage")));

// Reports
const ListResourceUtilizationPage = Loadable(lazy(() => import("pages/report/ListResourceUtilizationPage")));
const ListResourceUtilizationDetailsPage = Loadable(lazy(() => import("pages/report/ListResourceUtilizationDetailsPage")));
const ListWeeklyReportPage = Loadable(lazy(() => import("pages/report/ListWeeklyReportPage")));
const GenerateWeeklyReportPage = Loadable(lazy(() => import("pages/report/GenerateResourceReportPage")));

// Logs
const ListUserActionLogPage = Loadable(lazy(() => import("pages/logs/ListUserActionLogPage")));
const ListUserActionLogDetailsPage = Loadable(lazy(() => import("pages/logs/ListUserActionLogDetailsPage")));
const ListAdminActionLogDetailsPage = Loadable(lazy(() => import("pages/logs/ListAdminActionLogDetailsPage")));
const ListUserAccessLogPage = Loadable(lazy(() => import("pages/logs/ListUserAccessLogPage")));
const ListAdminActionLogPage = Loadable(lazy(() => import("pages/logs/ListAdminActionLogPage")));
const ListAdminAccessLogPage = Loadable(lazy(() => import("pages/logs/ListAdminAccessLogPage")));

const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "organisations",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/organisations", element: <ListOrganisationPage /> },
      { path: "/organisations/:requestId/view-details", element: <ListOrganisationDetailsPage /> },
      { path: "/organisations/:organisationId/users", element: <ListOrganisationUsersPage /> },
      { path: "/organisations/:organisationId/quota/:quotaId/resources", element: <ListOrganisationResourcesPage /> },
      { path: "/organisations/:organisationId/quota", element: <ListOrganisationQuotaPage /> },
      { path: "/organisations/:organisationId/quota/:quotaId/topup", element: <ListOrganisationQuotaTopupPage /> },
      { path: "/organisations/:organisationId/images", element: <ListOrganisationImagesPage /> },
      { path: "/organisations/:organisationId/flavors", element: <ListOrganisationFlavorsPage /> },
      { path: "/organisations/:organisationId/zones", element: <ListOrganisationZonesPage /> },
      { path: "/organisations/onboard-request", element: <ListOrganisationOnboardingRequestsPage /> },
      { path: "/organisations/onboard-request/create", element: <CreateOrganisationOnboardingRequestsPage hidden={() => !useIsInternalType()} /> },
      { path: "/organisations/onboard-request/:requestId/request-details", element: <ListOrganisationOnboardingRequestDetailsPage /> },
      { path: "/organisations/change-request/:requestId/request-details", element: <ListOrganisationOnboardingChangeRequestDetailsPage /> },
      { path: "/organisations/onboard-request/:requestId/users", element: <ListOrganisationOnboardingRequestUserDetailsPage /> },
      { path: "/organisations/change-request", element: <ListOrganisationOnboardingChangeRequestPage /> },
      { path: "/organisations/change-request/:requestId/users", element: <ListOrganisationOnboardingChangeRequestUserDetailsPage /> },
      { path: "/organisations/projects", element: <ListProjectPage /> },
      { path: "/organisations/projects/:requestId/view-details", element: <ListProjectDetailsPage /> },
      { path: "/organisations/projects/:projectId/users", element: <ListProjectUsersPage /> },
      { path: "/organisations/projects/:orgId/:projectId/providers", element: <ListProjectProviderMappingPage /> },
      { path: "/organisations/projects/:projectId/providers/:providerId/resources", element: <ListProjectResourcesPage /> },
      { path: "/organisations/projects/:projectId/providers/:providerId/create-security-group", element: <CreateSecurityGroupByTypePage /> },
      { path: "/organisations/projects/:projectId/providers/:providerId/apply-default-rule", element: <ApplyDefaultRuleWithProjectPage /> },
      { path: "/organisations/projects/:projectId/providers/:providerId/gateway-services", element: <ListProjectGatewayServicePage /> },
      { path: "/organisations/projects/:projectId/providers/:providerId/gateway-services/create", element: <CreateProjectGatewayServicePage /> },
      { path: "/organisations/quota-update", element: <ListQuotaPackageRequestPage /> },
      { path: "/organisations/quota-update/quota/:quotaId/resources", element: <ListQuotaRequestOrganisationResourecUtilizationPage /> },
      { path: "/organisations/quota-topup/quota/:quotaId/resources", element: <ListQuotaTopupOrganisationResourecUtilizationPage /> },
      { path: "/organisations/quota-withdraw/quota/:quotaId/resources", element: <ListTopupWithdrawlOrganisationResourecUtilizationPage /> },
      { path: "/organisations/quota-update/:requestId/request-details", element: <ListQuotaPackageRequestDetailsPage /> },
      { path: "/organisations/quota-topup", element: <ListTopupQuotaRequestPage /> },
      { path: "/organisations/quota-topup/:requestId/request-details", element: <ListQuotaTopupRequestDetailsPage /> },
      { path: "/organisations/quota-withdraw", element: <ListTopupWithdrawalRequestPage /> },
      { path: "/organisations/quota-withdraw/:requestId/request-details", element: <ListQuotaWithdrawRequestDetailsPage /> },
      { path: "/organisations/onboard-request/:userId/view-details", element: <ListOrgUserDetailsPage /> },
      { path: "/organisations/change-request/:userId/view-details", element: <ListOrgUserDetailsPage /> },
    ],
  },
  {
    path: "compute",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/compute/types", element: <ListVirtualMachinePage /> },
      { path: "/compute/:computeId/overview", element: <VirtualMachineDetailPage /> },
      { path: "/compute/:computeId/snapshots", element: <ListComputeAttachedSnapshotsPage /> },
      { path: "/compute/:computeId/volumes", element: <ListComputeAttachedVolumesPage /> },
      { path: "/compute/:computeId/security-groups", element: <ListComputeAttachedSGPage /> },
      { path: "/compute/:computeId/networks", element: <ListComputeAttachedNetworksPage /> },
      { path: "/compute/:computeId/console", element: <ComputeConsolePage /> },
      { path: "/compute/:computeId/console-logs", element: <ComputeConsoleLogsPage /> },
      { path: "/compute/:computeId/event-logs", element: <ListComputeEventLogsPage /> },
      { path: "/compute/scaling-groups", element: <ListScalingGroupPage /> },
      { path: "/compute/snapshots", element: <ListComputeSnapshotPage /> },
      { path: "/compute/snapshots/:requestId/view-details", element: <ComputeSnapshotDetailPage /> },
    ],
  },
  {
    path: "storage",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/storage/block-storage-list", element: <ListBlockStoragePage /> },
      { path: "/storage/:volumeId/compute", element: <ListVolumeAttachedComputePage /> },
      { path: "/storage/snapshots", element: <ListVolumeSnapshotPage /> },
      { path: "/storage/object-storage-onboarding", element: <ListObjectStorageOnboardingRequestsPage /> },
      // Onboarded Organisations
      { path: "/storage/object-storage-onboarded-organisations", element: <ListObjectStorageOnboardedOrganisation /> },
      { path: "/storage/object-storage-onboarded-organisations/:organisationId/view-details", element: <ObjectStorageOnboardedOrganisationDetailsPage /> },
      { path: "/storage/object-storage-onboarded-organisations/:organisationId/users", element: <ListOrganisationUsersPage /> },
      { path: "/storage/object-storage-onboarded-organisations/:organisationId/quota", element: <ListObjectStorageQuotaDetailsPage /> },
      { path: "/storage/object-storage-onboarded-organisations/onboard-request", element: <ListOrganisationQuotaPage /> },
      { path: "/storage/object-storage-onboarding/:requestId/request-details", element: <ListObjectStorageOnboardingRequestDetailsPage /> },
      { path: "/storage/object-storage-onboarding/:requestId/quota-update", element: <ListQuotaPackageRequestPage /> },
      { path: "/storage/object-storage-onboarding/:requestId/quota-topup", element: <ListTopupQuotaRequestPage /> },
      { path: "/storage/object-storage-onboarding/:requestId/quota-withdraw", element: <ListTopupWithdrawalRequestPage /> },
      { path: "/storage/object-storage-onboarding/:requestId/audit-logs/admin-trails", element: <ListAdminActionLogPage /> },
      { path: "/storage/object-storage-list", element: <ListObjectStorageBucketsPage /> },
      { path: "/storage/object-storage-list/:requestId/object-storage-quota-topup", element: <ListObjectStorageQuotaTopupPage /> },
      { path: "/storage/object-storage-list/:requestId/view-details", element: <ListObjectStorageBucketsDetailsPage /> },
      { path: "/storage/object-storage-provider", element: <ListObjectStorageProvidersPage /> },
      { path: "/storage/object-storage-provider/:requestId/view-details", element: <ListObjectStorageProvidersDetailsPage /> },
      { path: "/storage/object-storage-provider/:providerId/list-attached-quota", element: <ListOSProviderAttachedQuotaPage /> },
      { path: "/storage/quota-update", element: <ListObjectStorageQuotaPackagePage /> },
      { path: "/storage/quota-topup", element: <ListObjectStorageResourceTopupRequestPage /> },
      { path: "/storage/quota-topup/:requestId/request-details", element: <ListObjectStorageResourceTopupRequestDetailsPage /> },
      { path: "/storage/quota-withdraw", element: <ListObjectStorageResourceTopupWithdrawPage /> },
      { path: "/storage/quota-withdraw/:requestId/request-details", element: <ListObjectStorageResourceTopupWithdrawlRequestDetailsPage /> },
      { path: "/storage/quota-update/:requestId/request-details", element: <ListObjectStorageQuotaPackageDetailsPage /> },
      { path: "/storage/action-logs", element: <ListObjectStorageActionLogsPage /> },
      { path: "/storage/action-logs/:requestId/view-details", element: <ListObjectStorageActionLogsDetailsPage /> },
    ],
  },
  {
    path: "networks",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/networks", element: <ListNetworkPage /> },
      { path: "/networks/router", element: <ListRouterPage /> },
      { path: "/networks/security-groups", element: <ListSecurityGroupPage /> },
      { path: "/networks/security-group-rules", element: <ListSecurityGroupRulesPage /> },
      { path: "/networks/security-group-rule/create", element: <CreateSecurityGroupRulesPage /> },
      { path: "/networks/security-group-rule/sync", element: <SyncSecurityGroupRulesPage /> },
      { path: "/networks/security-groups/:id/rules", element: <ListSGRulesPage /> },
      { path: "/networks/floating-ip", element: <ListFloatingIPPage /> },
      { path: "/networks/floating-ip/reserve", element: <ReserveFloatingIPPage /> },
      { path: "/networks/public-ip-pools", element: <ListPublicIPPoolPage /> },
      { path: "/networks/public-ip-pools/import", element: <ImportPublicIPPoolPage /> },
      { path: "/networks/public-ip-pools/delete-pool", element: <DeletePublicIPPoolPage /> },
      { path: "/networks/public-ip-pools/:publicIpId/update", element: <UpdatePublicIPPage /> },
      { path: "/networks/public-ip-request", element: <ListRequestedPublicIPPage /> },
      { path: "/networks/public-ip-request/:requestId/request-details", element: <ListRequestedPublicIPDetailsPage /> },
      { path: "/networks/public-ip-withdraw-request", element: <ListPublicIPWithdrawalRequestPage /> },
      { path: "/networks/public-ip-withdraw-request/:requestId/request-details", element: <ListPublicIPWithdrawalRequestDetailsPage /> },
      { path: "/networks/public-ip-update-request", element: <ListPublicIPUpdateRequestPage /> },
      { path: "/networks/public-ip-update-request/:requestId/request-details", element: <ListPublicIPUpdateRequestDetailsPage /> },
      { path: "/networks/:routerId/network-details", element: <ListRouterNetworkDetailsPage /> },
    ],
  },
  {
    path: "backups",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/backups", element: <ListBackupPage /> },
      { path: "/backups/:requestId/view-details", element: <ListBackupDetailsPage /> },
      { path: "/backups/protection-groups", element: <ListProtectionGroupPolicyPage /> },
      { path: "/backups/protection-groups/:requestId/view-details", element: <ListProtectionGroupPolicyDetailsPage /> },
      { path: "/backups/public-ip-request", element: <ListBackupPublicIpPage /> },
      { path: "/backups/public-ip-request/:requestId/request-details", element: <ListBackupPublicIpDetailsPage /> },
      { path: "/backups/public-ip-update-request", element: <ListBackupPublicIpUpdatePage /> },
      { path: "/backups/public-ip-update-request/:requestId/request-details", element: <ListBackupPublicIpUpdateDetailsPage /> },
    ],
  },
  {
    path: "load-balancers",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/load-balancers", element: <ListLoadBalancerPage /> },
      { path: "/load-balancers/:requestId/view-details", element: <ListLoadBalancerDetailsPage /> },
      { path: "/load-balancers/fetch-applied-config", element: <ListLBAppliedConfigPage /> },
      { path: "/load-balancers/ssl-request", element: <ListSSLRequestPage /> },
      { path: "/load-balancers/ssl-request/:requestId/request-details", element: <ListSSLRequestDetailsPage /> },
      { path: "/load-balancers/ssl-cert", element: <ListSSLCertificatesPage /> },
      { path: "/load-balancers/ssl-cert/:requestId/view-details", element: <ListSSLCertificatesDetailsPage /> },
      { path: "/load-balancers/:lbId/lb-logs", element: <ListLBLogsPage /> },
      { path: "/load-balancers/:lbId/lb-config-template", element: <ListLBConfigTemplatePage /> },
    ],
  },
  {
    path: "providers",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/providers", element: <ListProviderPage /> },
      { path: "/providers/:requestId/view-details", element: <ListProviderDetailsPage /> },
      { path: "/providers/create", element: <CreateProviderPage /> },
      { path: "/providers/:providerId/attached-quota", element: <ListAttachedQuotaPage /> },
      { path: "/providers/:providerId/resource-topup", element: <ListResourceTopupPage /> },
      { path: "/providers/:providerId/resource-mapping", element: <ListProviderResourceMappingPage /> },
      { path: "/providers/:providerId/resource-mapping/create", element: <CreateProviderResourceMappingPage /> },
      { path: "/providers/:providerId/service-providers", element: <ListServiceProviderPage /> },
      { path: "/providers/:providerId/service-providers/create", element: <CreateServiceProviderPage /> },
      { path: "/providers/:providerId/service-providers/:serviceProviderId/update", element: <UpdateServiceProviderPage /> },
      { path: "/providers/images", element: <ListImagePage /> },
      { path: "/providers/images/:imageId/update", element: <UpdateImagePage /> },
      { path: "/providers/images/:imageId/map-organisation", element: <ImageOrganisationMappingPage /> },
      { path: "/providers/images/:imageId/resource-mapping", element: <ListImageResourceMappingPage /> },
      { path: "/providers/images/:imageId/init-script", element: <ManageImageInitScriptPage /> },
      { path: "/providers/images/:imageId/init-script-history", element: <ListInitScriptHistoryPage /> },
      { path: "/providers/images/:imageId/init-script-history/:scriptId/details", element: <InitScriptHistoryDetailPage /> },
      { path: "/providers/flavors", element: <ListFlavorPage /> },
      { path: "/providers/flavors/create", element: <CreateFlavorPage /> },
      { path: "/providers/flavors/:flavorId/update", element: <UpdateFlavorPage /> },
      { path: "/providers/flavors/:flavorId/map-organisation", element: <FlavorOrganisationMappingPage /> },
      { path: "/providers/availability-zones", element: <ListAvailabilityZonePage /> },
      { path: "/providers/availability-zones/:zoneId/update", element: <UpdateAvailabilityZonePage /> },
      { path: "/providers/availability-zones/:zoneId/map-organisation", element: <ZoneOrganisationMappingPage /> },
      { path: "/providers/default-rules", element: <ListDefaultRulePage /> },
      { path: "/providers/default-rules/create", element: <CreateDefaultRulePage /> },
      { path: "/providers/default-rules/:defaultRuleId/map-project", element: <DefaultRuleProjectMappingPage /> },
      { path: "/providers/default-rules/:defaultRuleId/apply-rule", element: <ApplyDefaultRuleOnProjectPage /> },
      { path: "/providers/resource-metrics", element: <ListResourceMetricPage /> },
      { path: "/providers/resource-metrics/create", element: <CreateResourceMetricPage /> },
      { path: "/providers/resource-metrics/:metricId/update", element: <UpdateResourceMetricPage /> },
      { path: "/providers/:providerId/hypervisors-info", element: <ListHypervisorPage /> },
      { path: "/providers/:providerId/openstack-nws", element: <ListOpenstackNetworkPage /> },
      { path: "/providers/:providerId/openstack-subnets", element: <ListOpenstackSubnetPage /> },
      { path: "/providers/:providerId/openstack-ports", element: <ListOpenstackPortPage /> },
      { path: "/providers/:providerId/openstack-floating-ip", element: <ListOpenstackFloatingIPPage /> },
      { path: "/providers/available-base-quota", element: <ListAvailableBaseQuotaPage /> },
      { path: "/providers/available-base-quota/:quotaId/mapped-organisations", element: <ListAvailableBaseQuotaMappedOrganisationPage /> },
      { path: "/providers/available-quota-topup", element: <ListAvailableTopupQuotaPage /> },
      { path: "/providers/master-base-quota", element: <ListMasterBaseQuotaPage /> },
      { path: "/providers/master-base-quota/:quotaId/mapped-organisations", element: <ListMasterBaseQuotaMappedOrganisationPage /> },
      { path: "/providers/master-base-quota/:quotaId/mapped-providers", element: <ListMasterBaseQuotaMappedProvidersPage /> },
      { path: "/providers/master-quota-topup", element: <ListMasterTopupQuotaPage /> },
    ],
  },
  {
    path: "users",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/users/all-users", element: <ListUserPage /> },
      { path: "/users/all-users/create", element: <CreateUserPage /> },
      { path: "/users/all-users/:userId/admin-portal-permissions", element: <ListAdminPortalPermissionPage /> },
      { path: "/users/all-users/:userId/service-portal-permissions", element: <ListServicePortalPermissionPage /> },
      { path: "/users/all-users/:userId/view-details", element: <ListUserDetailsPage /> },
      { path: "/users/admin-users", element: <ListAdminPage /> },
      { path: "/users/admin-users/:userId/view-details", element: <ListUserDetailsPage /> },
      { path: "/users/SSO-users", element: <ListSSOUserPage /> },
    ],
  },
  {
    path: "reports",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/reports/resource-utilization", element: <ListResourceUtilizationPage /> },
      { path: "/reports/resource-utilization/:organisationId/details", element: <ListResourceUtilizationDetailsPage /> },
      { path: "/reports/weekly-report", element: <ListWeeklyReportPage hidden={() => !useIsInternalType()} /> },
      { path: "/reports/weekly-report/generate", element: <GenerateWeeklyReportPage /> },
    ],
  },
  {
    path: "audit-logs",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/audit-logs/user-trails", element: <ListUserActionLogPage /> },
      { path: "/audit-logs/user-trails/:requestId/log-details", element: <ListUserActionLogDetailsPage /> },
      { path: "/audit-logs/user-access-logs", element: <ListUserAccessLogPage /> },
      { path: "/audit-logs/admin-trails", element: <ListAdminActionLogPage /> },
      { path: "/audit-logs/admin-trails/:requestId/log-details", element: <ListAdminActionLogDetailsPage /> },
      { path: "/audit-logs/admin-access-logs", element: <ListAdminAccessLogPage /> },
    ],
  },
  {
    path: "*",
    children: [{ path: "*", exact: true, element: <Navigate to="/organisations" replace /> }],
  },
];

export default routes;
