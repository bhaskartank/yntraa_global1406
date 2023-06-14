import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListInitScriptHistoryProps {
  fetchInitScriptHistory: any;
  exportInitScriptHistory: any;
}

const ListInitScriptHistory: FC<ListInitScriptHistoryProps> = ({ fetchInitScriptHistory, exportInitScriptHistory }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const initScriptHistory = providersRedux.getters.initScriptHistory(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Script Type" }, { label: "Updated By" }, { label: "Updated On" }], []);

  const exportColumns: string[] = useMemo(() => ["Script Type", "Updated By", "Updated On"], []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.script_type }, { content: item?.user?.username }, { content: formatDate(item?.updated) }], []);

  const exportCreator = useCallback((item: any) => {
    return [item?.resource_type, item?.status, formatDate(item?.created, false, true), formatDate(item?.updated, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Script",
      onClick: (item) => navigate(`${item?.id}/details`, { state: { initScript: item?.init_script, imageId: item?.image_id } }),
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchInitScriptHistory({ limit, offset }), [fetchInitScriptHistory]);

  const dataList = useDataList({
    data: initScriptHistory?.list || [],
    totalRecords: initScriptHistory?.totalRecords,
    columns,
    exportFilename: "Init Script History List",
    exportColumns,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportInitScriptHistory,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListInitScriptHistory;
