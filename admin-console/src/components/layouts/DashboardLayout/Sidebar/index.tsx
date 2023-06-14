import { Box, Drawer, IconButton, Stack, Typography, styled, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material";
import useIsInternalType from "hooks/useIsInternalType";
import { MenuCollapseIcon } from "icons";
import { FC, useCallback, useEffect, useMemo } from "react";
import { AiOutlineLineChart, AiOutlinePieChart } from "react-icons/ai";
import { BsGlobe, BsHddNetwork } from "react-icons/bs";
import { CgNotes, CgOrganisation } from "react-icons/cg";
import { FaBalanceScaleRight } from "react-icons/fa";
import { FiDatabase, FiUsers } from "react-icons/fi";
import { MdBackupTable, MdOutlineBackup } from "react-icons/md";
import { RiComputerLine, RiDatabaseLine } from "react-icons/ri";
import { TbBrandBitbucket } from "react-icons/tb";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import drawerRedux from "store/modules/drawer";

import LogoContainer from "components/atoms/LogoContainer";
import SearchBar from "components/molecules/SearchBar";
import useSearch from "components/molecules/SearchBar/useSearch";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "utilities/constants";

import { DashboardSidebarSection } from "./Section";
import { ItemProps } from "./model";

const LogoWrapper = styled(Box)(() => ({
  "&": {
    transform: "scale(1.6)",
  },
}));

const filterMenuSearch = ({ search, section }: { search: string; section: ItemProps }) => {
  return (
    section?.title?.toLowerCase()?.includes(search?.toLowerCase()) || (section?.items?.length ? section?.items?.some((sec) => filterMenuSearch({ search, section: sec })) : false)
  );
};

const getSections = ({ search = "", isInternalType = false }: { search?: string; isInternalType?: boolean }): ItemProps[] => {
  const sections = [
    {
      title: "Organisation",
      icon: <CgOrganisation />,
      items: [
        { title: "Organisations", path: "/organisations" },
        { title: "Onboarding Requests", path: "/organisations/onboard-request" },
        { title: "Onboarding Change Requests", path: "/organisations/change-request" },
        { title: "Projects", path: "/organisations/projects" },
        {
          title: "Quota Package Requests",
          icon: <AiOutlinePieChart />,
          items: [
            { title: "Quota Package Requests", path: "/organisations/quota-update" },
            { title: "Topup Quota Requests", path: "/organisations/quota-topup" },
            { title: "Topup Withdrawal Requests", path: "/organisations/quota-withdraw" },
          ],
        },
      ],
    },
    {
      title: "Compute",
      icon: <RiComputerLine />,
      items: [
        { title: "Virtual Machines", path: "/compute/types" },
        { title: "Scaling Groups", path: "/compute/scaling-groups" },
        { title: "Compute Snapshots", path: "/compute/snapshots" },
      ],
    },
    {
      title: "Storage",
      icon: <FiDatabase />,
      items: [
        { title: "Block Storage (SAN)", path: "/storage/block-storage-list" },
        { title: "Volume Snapshots", path: "/storage/snapshots" },
        {
          title: "Object Storage",
          icon: <TbBrandBitbucket />,
          items: [
            { title: "Onboarding Requests", path: "/storage/object-storage-onboarding" },
            { title: "Onboarded Organisations", path: "/storage/object-storage-onboarded-organisations" },
            { title: "Object Storage Providers", path: "/storage/object-storage-provider" },
            { title: "Bucket List", path: "/storage/object-storage-list" },
            {
              title: "Quota Package",
              icon: <AiOutlinePieChart />,
              items: [
                { title: "Quota Package Requests", path: "/storage/quota-update" },
                { title: "Topup Quota Requests", path: "/storage/quota-topup" },
                { title: "Topup Withdrawal Requests", path: "/storage/quota-withdraw" },
              ],
            },
            { title: "Action Logs", path: "/storage/action-logs" },
          ],
        },
      ],
    },
    {
      title: "Network",
      icon: <BsHddNetwork />,
      items: [
        { title: "Networks", path: "/networks" },
        { title: "Routers", path: "/networks/router" },
        { title: "Security Groups", path: "/networks/security-groups" },
        { title: "Security Group Rules", path: "/networks/security-group-rules" },
        { title: "Floating IP", path: "/networks/floating-ip" },
        {
          title: "Public IP",
          icon: <BsGlobe />,
          items: [
            { title: "Public IP Pool", path: "/networks/public-ip-pools" },
            { title: "Requested Public IPs", path: "/networks/public-ip-request" },
            { title: "Public IP Withdrawal Request", path: "/networks/public-ip-withdraw-request" },
            { title: "Public IP Update Request", path: "/networks/public-ip-update-request" },
          ],
        },
      ],
    },
    {
      title: "Backup",
      icon: <MdOutlineBackup />,
      items: [
        { title: "Backup List", path: "/backups" },
        { title: "Protection Group Policy", path: "/backups/protection-groups" },
        {
          title: "Backup Verification",
          icon: <MdBackupTable />,
          items: [
            { title: "Public IP Requests", path: "/backups/public-ip-request" },
            { title: "Public IP Update Requests", path: "/backups/public-ip-update-request" },
          ],
        },
      ],
    },
    {
      title: "Load Balancers",
      icon: <FaBalanceScaleRight />,
      items: [
        { title: "Load Balancers", path: "/load-balancers" },
        { title: "SSL Configuration Requests", path: "/load-balancers/ssl-request" },
        { title: "SSL Certificates", path: "/load-balancers/ssl-cert" },
      ],
    },
    {
      title: "Provider",
      icon: <RiDatabaseLine />,
      items: [
        { title: "Providers", path: "/providers" },
        { title: "Images", path: "/providers/images" },
        { title: "Flavors", path: "/providers/flavors" },
        { title: "Availability Zones", path: "/providers/availability-zones" },
        { title: "Default Rules", path: "/providers/default-rules" },
        { title: "Resource Metrics", path: "/providers/resource-metrics" },
        {
          title: "Available Quota Package",
          icon: <AiOutlinePieChart />,
          items: [
            { title: "Available Base Quota", path: "/providers/available-base-quota" },
            { title: "Available Quota Topup", path: "/providers/available-quota-topup" },
          ],
        },
        ...(isInternalType
          ? [
              {
                title: "Master List Quota Package",
                icon: <AiOutlinePieChart />,
                items: [
                  { title: "Master List of Base Quota", path: "/providers/master-base-quota" },
                  { title: "Master List of Quota Topup", path: "/providers/master-quota-topup" },
                ],
              },
            ]
          : []),
      ],
    },
    {
      title: "Users",
      icon: <FiUsers />,
      items: [
        { title: "All Users", path: "/users/all-users" },
        { title: "Admin Users", path: "/users/admin-users" },
        { title: "SSO Users", path: "/users/SSO-users" },
      ],
    },
    {
      title: "Report",
      icon: <AiOutlineLineChart />,
      items: [{ title: "Resource Utilization", path: "/reports/resource-utilization" }, ...(isInternalType ? [{ title: "Weekly Report", path: "/reports/weekly-report" }] : [])],
    },
    {
      title: "Logs",
      icon: <CgNotes />,
      items: [
        { title: "User Action Logs", path: "/audit-logs/user-trails" },
        { title: "User Access Logs", path: "/audit-logs/user-access-logs" },
        { title: "Admin Action Logs", path: "/audit-logs/admin-trails" },
        { title: "Admin Access Logs", path: "/audit-logs/admin-access-logs" },
      ],
    },
  ];

  return search ? sections?.filter((section) => filterMenuSearch({ search, section })) : sections;
};

export const DashboardSidebar: FC = () => {
  const location = useLocation();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), { noSsr: true });

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const open = drawerRedux.getters.open(rootState);

  const isInternalType = useIsInternalType();

  const { localSearchTerm, handleClearSearch, handleSearch } = useSearch();

  const sections = useMemo(() => getSections({ search: localSearchTerm, isInternalType }), [isInternalType, localSearchTerm]);

  const onOpenSidebar = useCallback(() => {
    dispatch(drawerRedux.actions.open());
  }, [dispatch]);

  const onCloseSidebar = useCallback(() => {
    dispatch(drawerRedux.actions.close());
  }, [dispatch]);

  const content = (
    <>
      <Stack direction="row" alignItems="center" gap={4} sx={{ padding: "8px 16px" }}>
        <IconButton onClick={() => (open ? onCloseSidebar() : onOpenSidebar())}>
          <MenuCollapseIcon />
        </IconButton>
        <LogoWrapper>
          <LogoContainer variant="light" />
        </LogoWrapper>
      </Stack>

      <Box component="span" sx={{ display: "inline-flex", mt: 1, mb: 2, mx: "20px" }}>
        <SearchBar onClick={onOpenSidebar} icon clearButton onChange={handleSearch} onClear={handleClearSearch} placeholder="Search Menu" externalStyles={{ pl: 0 }} />
      </Box>

      <Box sx={{ position: "relative", flexGrow: 1, pb: 4, height: "100%", overflowY: "auto" }}>
        {sections?.length ? (
          <DashboardSidebarSection items={sections} path={location?.pathname} />
        ) : (
          <Typography textAlign="center" variant="body2" mt={1} sx={{ color: "common.white" }}>
            No Results Found
          </Typography>
        )}
      </Box>
    </>
  );

  useEffect(() => {
    if (lgUp) onOpenSidebar();
    else onCloseSidebar();
  }, [lgUp, onCloseSidebar, onOpenSidebar]);

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          overflowX: open ? "visible" : "hidden",
          borderRightColor: "divider",
          borderRightStyle: "solid",
          borderRightWidth: 0,
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          height: "100vh",
          transition: "width 500ms",
        },
      }}>
      {content}
    </Drawer>
  );
};
