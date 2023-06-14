import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListComputeAttachedSGProps {
  fetchSecurityGroups: any;
  exportSecurityGroups: any;
}

const ListComputeAttachedSGs: FC<ListComputeAttachedSGProps> = ({ fetchSecurityGroups, exportSecurityGroups }) => {
  const navigate = useNavigate();

  const rootState = useSelector((state: any) => state);
  const { list, providerId, projectId } = virtualMachinesRedux.getters.securityGroups(rootState);

  const modifiedList = useMemo(() => {
    return list?.map((item) => ({ ...item?.security_group }));
  }, [list]);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Provider Security Group ID", align: "center" },
      { label: "Security Group Type", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Provider Security Group ID", "Security Group Type", "Status", "Created"], []);

  const actions: ActionProps[] = [
    {
      label: () => "Manage Security Rules",
      onClick: (item) => {
        navigate(`/networks/security-groups/${item?.id}/rules`, {
          state: { securityGroup: item, providerId, projectId },
        });
      },
    },
  ];

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.security_group_name} /> },
      { content: item?.provider_security_group_id, align: "center" },
      { content: item?.security_group_type ? <StatusChip label={item?.security_group_type} customStyle={{ textTransform: "uppercase" }} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created, false), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.security_group_name, item?.provider_security_group_id, item?.security_group_type?.toUpperCase(), item?.status, formatDate(item?.created, false, true)];
  }, []);

  const reload = useCallback(fetchSecurityGroups, [fetchSecurityGroups]);

  const dataList = useDataList({
    data: modifiedList,
    columns,
    exportColumns,
    exportFilename: "Attached Security Groups List",
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportSecurityGroups,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListComputeAttachedSGs;
