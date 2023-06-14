import { FC, useCallback, useMemo, useState } from "react";

import { useSelector } from "store";
import usersRedux from "store/modules/users";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

import UserScopesModal from "./UserScopesModal";

export const enum MODAL_TYPE {
  USER_SCOPES = "USER_SCOPES",
}

interface ListAdminPortalPermissionProps {
  fetchAdminPortalPermissions: any;
  exportAdminPortalPermissions: any;
  unassignRole: (scopeId: number) => void;
}

const ListAdminPortalPermissions: FC<ListAdminPortalPermissionProps> = ({ fetchAdminPortalPermissions, exportAdminPortalPermissions, unassignRole }) => {
  const rootState = useSelector((state: any) => state);
  const adminPortalPermissions = usersRedux.getters.adminPortalPermissions(rootState);

  const [scopes, setScopes] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => {
    setActiveModal(null);
    setScopes([]);
  };

  const columns: ColumnProps[] = useMemo(() => [{ label: "Provider Name" }, { label: "User Role" }, { label: "Assigned On" }], []);

  const exportColumns: string[] = useMemo(() => ["Provider Name", "User Role", "Assigned On", "Scopes"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [{ content: item?.provider?.provider_name }, { content: item?.role_permission_group?.group_name }, { content: formatDate(item?.created) }],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.provider?.provider_name, item?.role_permission_group?.group_name, formatDate(item?.created, false, true), item?.role_permission_group?.scope?.join(", ")];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Scopes",
      onClick: (item) => {
        handleOpenModal(MODAL_TYPE.USER_SCOPES);
        setScopes(item?.role_permission_group?.scope);
      },
    },
    {
      label: () => "Unassign Role",
      confirmation: () => ({
        title: "Unassign Role",
        description: "Are you sure you want to unassign this role?",
      }),
      onClick: (item) => unassignRole(item?.id),
      color: "error.main",
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchAdminPortalPermissions({ limit, offset }), [fetchAdminPortalPermissions]);

  const dataList = useDataList({
    data: adminPortalPermissions?.list || [],
    totalRecords: adminPortalPermissions?.totalRecords,
    columns,
    actions,
    exportFilename: "Admin Portal Permissions List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportAdminPortalPermissions,
    reload,
  });

  return (
    <>
      <DataList dataList={dataList} />
      <UserScopesModal isOpen={activeModal === MODAL_TYPE.USER_SCOPES} onClose={handleCloseModal} scopes={scopes} />
    </>
  );
};

export default ListAdminPortalPermissions;
