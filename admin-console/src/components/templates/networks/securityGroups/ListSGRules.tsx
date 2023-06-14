import { Box } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useSelector } from "store";
// import networksRedux from "store/modules/virtualMachines";
import networksRedux from "store/modules/networks";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListSGRulesProps {
  fetchSecurityGroupRules: any;
  exportSecurityGroupRules: any;
}

const ListSGRules: FC<ListSGRulesProps> = ({ fetchSecurityGroupRules, exportSecurityGroupRules }) => {
  const rootState = useSelector((state: any) => state);
  const { list, totalRecords } = networksRedux.getters.securityGroupRules(rootState);
  const securityGroupId = useParams();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Direction", sortKey: "direction", filterKey: "direction", filters: list?.filter_values?.direction },
      { label: "Remote IP", sortKey: "remote_ip_prefix", align: "center" },
      { label: "Port Range", align: "center" },
      { label: "Protocol", sortKey: "protocol", align: "center", filterKey: "protocol", filters: list?.filter_values?.protocol },
      { label: "Ethertype", sortKey: "ethertype", align: "center", filterKey: "ethertype", filters: list?.filter_values?.ethertype },
      { label: "Managed By", sortKey: "managed_by", align: "center", filterKey: "managed_by", filters: list?.filter_values?.managed_by },
      { label: "Status", sortKey: "status", align: "center", filterKey: "status", filters: list?.filter_values?.status },
    ],
    [list],
  );

  const exportColumns: string[] = useMemo(() => ["Direction", "Remote IP", "Port Range", "Protocol", "Ethertype", "Managed By", "Status"], []);

  const searchFields = useMemo(
    () => [
      { key: "direction", label: "Direction" },
      { key: "remote_ip_prefix", label: "Remote IP" },
      { key: "protocol", label: "Protocol" },
      { key: "ethertype", label: "Ethertype" },
      { key: "managed_by", label: "Managed By" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.direction} /> },
      { content: item?.remote_ip_prefix, align: "center" },
      { content: `${item?.port_range_min} - ${item?.port_range_max}`, align: "center" },
      {
        content: (
          <Box component="span" textTransform="uppercase">
            {item?.protocol}
          </Box>
        ),
        align: "center",
      },
      { content: item?.ethertype, align: "center" },
      { content: item?.managed_by ? <StatusChip label={item?.managed_by} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.direction,
      item?.remote_ip_prefix,
      `${item?.port_range_min} - ${item?.port_range_max}`,
      item?.protocol?.toUpperCase(),
      item?.managed_by?.toUpperCase(),
      item?.status,
    ];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy }) =>
      fetchSecurityGroupRules({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search, filters: `{"security_group_id": [${securityGroupId?.id}]}` }),
    [fetchSecurityGroupRules, securityGroupId],
  );

  const dataList = useDataList({
    data: list?.data || [],
    totalRecords,
    columns,
    exportColumns,
    searchFields,
    exportFilename: "Security Groups Rules List",
    rowCreator,
    exportCreator,
    listExporter: exportSecurityGroupRules,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSGRules;
