import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListDefaultRules from "components/templates/providers/defaultRules/ListDefaultRules";

const ListDefaultRulePage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchDefaultRules = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.defaultRules(payload));
    },
    [dispatch],
  );

  const exportDefaultRules = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportDefaultRules());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const deleteDefaultRule = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.deleteDefaultRule(payload?.provider_id, { default_rule_id: payload?.id }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Default Rules" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Default Rules" }]}>
      <ListDefaultRules fetchDefaultRules={fetchDefaultRules} exportDefaultRules={exportDefaultRules} deleteDefaultRule={deleteDefaultRule} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListDefaultRulePage;
