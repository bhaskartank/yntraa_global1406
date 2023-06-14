import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import networksRedux from "store/modules/networks";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListSecurityGroupProps {
  fetchSecurityGroupRules: any;
  exportSecurityGroupRules: any;
}

const ListSecurityGroups: FC<ListSecurityGroupProps> = ({ fetchSecurityGroupRules, exportSecurityGroupRules }) => {
  const rootState = useSelector((state: any) => state);
  const securityGroups = networksRedux.getters.securityGroupRules(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        label: "Security Group Name",
        filterKey: "security_group_id",
        filters: securityGroups?.list?.filter_values?.security_group?.map((item) => ({ label: item?.security_group_name, value: item?.id })),
      },
      { label: "Direction", sortKey: "direction", filterKey: "direction", filters: securityGroups?.list?.filter_values?.direction },
      { label: "Remote IP", sortKey: "remote_ip_prefix" },
      { label: "Port Range Min", sortKey: "port_range_min" },
      { label: "Port Range Max", sortKey: "port_range_max" },
      { label: "Protocol", sortKey: "protocol", filterKey: "protocol", filters: securityGroups?.list?.filter_values?.protocol, defaultHidden: true },
      { label: "Ethertype", sortKey: "ethertype", filterKey: "ethertype", filters: securityGroups?.list?.filter_values?.ethertype, defaultHidden: true },
      { label: "Managed By", sortKey: "managed_by", filterKey: "managed_by", filters: securityGroups?.list?.filter_values?.managed_by },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: securityGroups?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [securityGroups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => ["Security Group Name", "Direction", "Remote IP", "Port Range Min", "Port Range Max", "Protocol", "Ethertype", "Managed By", "Status", "Created"],
    [],
  );

  const searchFields = useMemo(() => [{ key: "security_group_name", label: "Name" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.security_group.security_group_name} /> },
      { content: <ResourceName label={item?.direction} /> },
      { content: <ResourceName label={item?.remote_ip_prefix} /> },
      { content: <ResourceName label={item?.port_range_min} /> },
      { content: <ResourceName label={item?.port_range_max} /> },
      { content: <ResourceName label={item?.protocol} /> },
      { content: <ResourceName label={item?.ethertype} /> },
      { content: item?.managed_by !== null && item?.managed_by !== undefined ? <StatusChip label={item?.managed_by} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.direction,
      item?.remote_ip_prefix,
      item?.port_range_min,
      item?.port_range_max,
      item?.protocol,
      item?.ethertype,
      item?.managed_by,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSecurityGroupRules({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchSecurityGroupRules],
  );

  const dataList = useDataList({
    data: securityGroups?.list?.data || [],
    totalRecords: securityGroups?.totalRecords,
    columns,
    exportFilename: "SecurityGroups Rules List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportSecurityGroupRules,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSecurityGroups;
