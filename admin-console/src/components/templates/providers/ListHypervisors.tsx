import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListHypervisorProps {
  fetchHypervisors: any;
  exportHypervisors: any;
}

const ListHypervisors: FC<ListHypervisorProps> = ({ fetchHypervisors, exportHypervisors }) => {
  const rootState = useSelector((state: any) => state);
  const hypervisors = providersRedux.getters.hypervisors(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Hostname" },
      { label: "Type", align: "center" },
      { label: "Host IP", align: "center" },
      { label: "Disk Used / Disk Size (GiB)", align: "center" },
      { label: "Memory Used / Memory Size", align: "center" },
      { label: "VCPUs Used / VCPUs Total", align: "center" },
      { label: "Instances", align: "center" },
      { label: "Status", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(
    () => ["Hostname", "Type", "Host IP", "Disk Size / Disk Used (GiB)", "Memory Size / Memory Used", "VCPUs Total / VCPUs Used", "Instances", "Status"],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.name} /> },
      { content: item?.hypervisor_type, align: "center" },
      { content: item?.host_ip, align: "center" },
      { content: `${item?.local_disk_used} / ${item?.local_disk_size}`, align: "center" },
      { content: `${item?.memory_used} / ${item?.memory_size}`, align: "center" },
      { content: `${item?.vcpus_used} / ${item?.vcpus}`, align: "center" },
      { content: item?.running_vms, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.hypervisor_type,
      item?.host_ip,
      `${item?.local_disk_size} / ${item?.local_disk_used}`,
      `${item?.memory_size} / ${item?.memory_used}`,
      `${item?.vcpus} / ${item?.vcpus_used}`,
      item?.running_vms,
      item?.status?.toUpperCase(),
    ];
  }, []);

  const reload = useCallback(fetchHypervisors, [fetchHypervisors]);

  const dataList = useDataList({
    data: hypervisors?.list || [],
    columns,
    exportFilename: "Hypervisors List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportHypervisors,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListHypervisors;
