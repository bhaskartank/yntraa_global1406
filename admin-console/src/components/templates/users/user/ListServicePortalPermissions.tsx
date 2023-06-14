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

interface ListServicePortalPermissionProps {
  fetchServicePortalPermissions: any;
  exportServicePortalPermissions: any;
}

const ListServicePortalPermissions: FC<ListServicePortalPermissionProps> = ({ fetchServicePortalPermissions, exportServicePortalPermissions }) => {
  const rootState = useSelector((state: any) => state);
  const servicePortalPermissions = usersRedux.getters.servicePortalPermissions(rootState);

  const [scopes, setScopes] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => {
    setActiveModal(null);
    setScopes([]);
  };

  const columns: ColumnProps[] = useMemo(() => [{ label: "Organisation Name" }, { label: "Project Name" }, { label: "User Role" }, { label: "Assigned On" }], []);

  const exportColumns: string[] = useMemo(() => ["Organisation Name", "Project Name", "User Role", "Assigned On", "Scopes"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.organisation?.name },
      { content: item?.project?.name },
      { content: item?.role_permission_group?.group_name },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.organisation?.name,
      item?.project?.name,
      item?.role_permission_group?.group_name,
      item?.role_permission_group?.scope?.join(", "),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Scopes",
      onClick: (item) => {
        handleOpenModal(MODAL_TYPE.USER_SCOPES);
        setScopes(item?.role_permission_group?.scope);
      },
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchServicePortalPermissions({ limit, offset }), [fetchServicePortalPermissions]);

  const dataList = useDataList({
    data: servicePortalPermissions?.list || [],
    totalRecords: servicePortalPermissions?.totalRecords,
    columns,
    actions,
    exportFilename: "Service Portal Permissions List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportServicePortalPermissions,
    reload,
  });

  return (
    <>
      <DataList dataList={dataList} />
      <UserScopesModal isOpen={activeModal === MODAL_TYPE.USER_SCOPES} onClose={handleCloseModal} scopes={scopes} />
    </>
  );
};

export default ListServicePortalPermissions;
