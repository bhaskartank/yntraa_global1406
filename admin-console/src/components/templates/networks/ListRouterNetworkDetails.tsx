import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import networksRedux from "store/modules/networks";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListRouterNetworkDetailsProps {
  fetchRouterNetworkDetails: any;
  exportRouterNetworkDetails: any;
}

const ListRouterNetworkDetails: FC<ListRouterNetworkDetailsProps> = ({ fetchRouterNetworkDetails, exportRouterNetworkDetails }) => {
  const rootState = useSelector((state: any) => state);
  const routers = networksRedux.getters.routerNetworkDetails(rootState);
  // const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [{ label: "Name" }, { label: "Status", align: "center" }, { label: "External", align: "center" }, { label: "Admin State", align: "center" }],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Network Name", "Status", "External", "Admin State"], []);

  // const searchFields = useMemo(() => [{ key: "router_name", label: "Name" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item.network_name },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: item?.external ? <StatusChip label={item?.external} /> : null, align: "center" },
      { content: item?.admin_state ? <StatusChip label={item?.admin_state} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.network_name, item?.status, item?.external, item?.admin_state];
  }, []);

  // const actions: ActionProps[] = [
  //   {
  //     label: () => "Subnet Details",
  //     onClick: (item) => navigate(`/networks/${item?.id}/network-details`, { state: { compute: item } }),
  //   },
  // ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchRouterNetworkDetails({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchRouterNetworkDetails],
  );

  const dataList = useDataList({
    data: routers?.list?.network_details || [],
    totalRecords: routers?.list?.network_details?.length,
    columns,
    // actions,
    exportFilename: "Routers Network Details",
    exportColumns,
    // searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportRouterNetworkDetails,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListRouterNetworkDetails;
