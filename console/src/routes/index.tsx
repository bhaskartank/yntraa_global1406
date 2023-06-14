import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "routes/Guard";

import SuspenseLoader from "components/atoms/loaders/SuspenseLoader/LoadingScreen";
import { DashboardLayout } from "components/layouts/DashboardLayout";

import { appRoutes } from "utils/constants";

const Loadable = (Component) => (myProps) => {
  return <Suspense fallback={<SuspenseLoader />}>{!!myProps?.hidden && myProps?.hidden() ? null : <Component {...myProps} />}</Suspense>;
};

// Login
const LoginPage = Loadable(lazy(() => import("pages/LoginPage")));

// Authenticate
const AuthenticatePage = Loadable(lazy(() => import("pages/AuthenticatePage")));

// Onboarding
const OnboardingPage = Loadable(lazy(() => import("pages/OnboardingPage")));

// Dashboard
const DashboardPage = Loadable(lazy(() => import("pages/DashboardPage")));

// Project
const ListProjectPage = Loadable(lazy(() => import("pages/project/ListProjectPage")));
const CreateProjectPage = Loadable(lazy(() => import("pages/project/CreateProjectPage")));

// Quota Package
const ListQuotaPackagePage = Loadable(lazy(() => import("pages/quota-package/ListQuotaPackagePage")));

// Compute
const ListComputePage = Loadable(lazy(() => import("pages/compute/ListComputePage")));
const VirtualMachineDetailPage = Loadable(lazy(() => import("pages/compute/VirtualMachineDetailPage")));
const CreateVirtualMachinePage = Loadable(lazy(() => import("pages/compute/CreateVirtualMachinePage")));

// Storage
const ListStoragePage = Loadable(lazy(() => import("pages/storage/ListStoragePage")));
const VolumeDetailPage = Loadable(lazy(() => import("pages/storage/VolumeDetailPage")));
const CreateVolumePage = Loadable(lazy(() => import("pages/storage/CreateVolumePage")));

// Network
const ListNetworkPage = Loadable(lazy(() => import("pages/network/ListNetworkPage")));
const NetworkDetailPage = Loadable(lazy(() => import("pages/network/NetworkDetailPage")));
const CreateNetworkPage = Loadable(lazy(() => import("pages/network/CreateNetworkPage")));
const SecurityGroupDetailPage = Loadable(lazy(() => import("pages/network/SecurityGroupDetailPage")));
const CreateSecurityGroupPage = Loadable(lazy(() => import("pages/network/CreateSecurityGroupPage")));
const CreateSecurityRulePage = Loadable(lazy(() => import("pages/network/CreateSecurityRulePage")));

// Resource Utilization
const ListResourceUtilizationPage = Loadable(lazy(() => import("pages/resource-utilization/ListResourceUtilizationPage")));

// User
const ListUserPage = Loadable(lazy(() => import("pages/user/ListUserPage")));

// Logs
const ListLogPage = Loadable(lazy(() => import("pages/log/ListLogPage")));

// Request Raised
const ListRequestRaisedPage = Loadable(lazy(() => import("pages/request-raised/ListRequestRaisedPage")));

const routes = [
  {
    path: appRoutes.LOGIN,
    element: (
      <AuthGuard>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: appRoutes.AUTHENTICATE,
    element: (
      <AuthGuard>
        <AuthenticatePage />
      </AuthGuard>
    ),
  },
  {
    path: appRoutes.ONBOARDING,
    element: (
      <AuthGuard>
        <OnboardingPage />
      </AuthGuard>
    ),
  },
  {
    path: appRoutes.DASHBOARD,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.DASHBOARD,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: appRoutes.PROJECT,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.PROJECT,
        element: <ListProjectPage />,
      },
      {
        path: appRoutes.CREATE_PROJECT,
        element: <CreateProjectPage />,
      },
    ],
  },
  {
    path: appRoutes.QUOTA_PACKAGE,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.QUOTA_PACKAGE,
        element: <ListQuotaPackagePage />,
      },
    ],
  },
  {
    path: appRoutes.COMPUTE,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.COMPUTE,
        element: <ListComputePage />,
      },
      {
        path: appRoutes.VIRTUAL_MACHINE_DETAIL(":virtualMachineId", ":section"),
        element: <VirtualMachineDetailPage />,
      },
      {
        path: appRoutes.CREATE_VIRTUAL_MACHINE,
        element: <CreateVirtualMachinePage />,
      },
    ],
  },
  {
    path: appRoutes.STORAGE,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.STORAGE,
        element: <ListStoragePage />,
      },
      {
        path: appRoutes.VOLUME_DETAIL(":volumeId", ":section"),
        element: <VolumeDetailPage />,
      },
      {
        path: appRoutes.CREATE_VOLUME,
        element: <CreateVolumePage />,
      },
    ],
  },
  {
    path: appRoutes.NETWORK,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.NETWORK,
        element: <ListNetworkPage />,
      },
      {
        path: appRoutes.NETWORK_DETAIL(":networkId", ":section"),
        element: <NetworkDetailPage />,
      },
      {
        path: appRoutes.CREATE_NETWORK,
        element: <CreateNetworkPage />,
      },
      {
        path: appRoutes.SECURITY_GROUP_DETAIL(":securityGroupId", ":section"),
        element: <SecurityGroupDetailPage />,
      },
      {
        path: appRoutes.CREATE_SECURITY_GROUP,
        element: <CreateSecurityGroupPage />,
      },
      {
        path: appRoutes.CREATE_SECURITY_RULE(":securityGroupId"),
        element: <CreateSecurityRulePage />,
      },
    ],
  },
  {
    path: appRoutes.RESOURCE_UTILIZATION,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.RESOURCE_UTILIZATION,
        element: <ListResourceUtilizationPage />,
      },
    ],
  },
  {
    path: appRoutes.USER,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.USER,
        element: <ListUserPage />,
      },
    ],
  },
  {
    path: appRoutes.LOGS,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.LOGS,
        element: <ListLogPage />,
      },
    ],
  },
  {
    path: appRoutes.REQUEST_RAISED,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: appRoutes.REQUEST_RAISED,
        element: <ListRequestRaisedPage />,
      },
    ],
  },
  {
    path: "*",
    children: [{ path: "*", exact: true, element: <Navigate to={appRoutes.DASHBOARD} replace /> }],
  },
];

export default routes;
