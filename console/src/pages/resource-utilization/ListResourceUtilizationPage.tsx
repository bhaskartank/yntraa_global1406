import moment from "moment";
import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "store";
import resourceUtilizationRedux from "store/modules/resource-stats";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListResourceUtilization from "components/templates/resource-utilization/ListResourceUtilization";

import { pageTitles } from "utils/constants";

const ListResourceUtilizationPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const resourceStatsList = resourceUtilizationRedux.getters.resourceStatsList(rootState);
  const [date, setDate] = useState<Date | null>(new Date());

  const fetchResourceUtilization = useCallback(
    (date) => {
      dispatch(
        resourceUtilizationRedux.actions.stats({
          from_date: moment(date)?.utc()?.format("YYYY-MM-DD"),
          to_date: moment(date)?.utc()?.format("YYYY-MM-DD"),
        }),
      );
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_RESOURCE_UTILIZATION}>
      <ListResourceUtilization list={resourceStatsList} fetchList={fetchResourceUtilization} />
    </PageContainer>
  );
};

export default ListResourceUtilizationPage;
