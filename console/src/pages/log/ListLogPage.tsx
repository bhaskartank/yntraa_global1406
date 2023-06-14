import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import auditRedux from "store/modules/audit";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListLogs from "components/templates/log/ListLog";

import { pageTitles } from "utils/constants";

const ListLogPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const auditTrails = auditRedux.getters.auditTrails(rootState);

  const fetchLogs = useCallback(
    (payload) => {
      dispatch(
        auditRedux.actions.auditTrails({
          ...payload,
          // limit: rowsPerPage,
          // offset: page * rowsPerPage,
          // ...(isLoggedInUser ? { user_id: userId } : {}),
          // ...(resourceType !== "all" ? { resource_type: resourceType } : {}),
          // ...(status !== "all" ? { status } : {}),
          // ...(methodType !== "all" ? { action_method: methodType } : {}),
          // ...(localSearchTerm ? { resource_name: localSearchTerm } : {}),
          // ...(date[0] && date[1] ? { from_date: date[0], to_date: date[1] } : {}),
          // ...(order && orderBy ? { order, field: orderBy } : {}),
        }),
      );
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_LOG}>
      <ListLogs list={auditTrails?.list} totalRecords={auditTrails?.totalRecords} fetchList={fetchLogs} />
    </PageContainer>
  );
};

export default ListLogPage;
