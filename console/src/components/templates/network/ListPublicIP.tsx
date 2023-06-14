import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListPublicIPProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListPublicIP: FC<ListPublicIPProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.request_id} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Application Name" value={item?.application_name} />
            <KeyValuePair label="Aadhar Compliance" value={item?.aadhar_compliance} />
            <KeyValuePair label="Attached With" value={`${item?.routable_ip_attached_with} (${item?.routable_ip})`} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [],
  );

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListPublicIP;
