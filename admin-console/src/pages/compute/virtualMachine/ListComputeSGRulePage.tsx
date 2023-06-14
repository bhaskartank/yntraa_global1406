import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListComputeSGRules from "components/templates/compute/ListComputeSGRules";
import SGRulesDetailBar from "components/templates/networks/securityGroups/SGRulesDetailBar";

const ListComputeSGRulePage = () => {
  const dataListKey = useCurrentPath();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { providerId, projectId, securityGroup }: { providerId: any; projectId: any; securityGroup: any } = routerState;
  const fetchSecurityGroupRules = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.securityGroupRules(payload));
    },
    [dispatch],
  );

  const exportSecurityGroupRules = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportSecurityGroupRules());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const deleteSGRules = useCallback(
    async (payload) => {
      try {
        await dispatch(
          networksRedux.actions.deleteSGRules(providerId, projectId, securityGroup?.id, {
            security_group_rule_id: payload,
          }),
        );
        dispatch(datalistRedux.actions.addListToRefresh({ key: dataListKey, keepCurrentPage: false }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, securityGroup, dataListKey, providerId, projectId],
  );

  return (
    <PageContainer title="Security Group Rules" breadcrumbs={[{ label: "Security Groups", to: "/networks/security-groups" }, { label: "Security Group Rules" }]}>
      <SGRulesDetailBar securityGroups={securityGroup} />
      <ListComputeSGRules
        securityGroups={securityGroup}
        fetchSecurityGroupRules={fetchSecurityGroupRules}
        exportSecurityGroupRules={exportSecurityGroupRules}
        handleDelete={deleteSGRules}
      />
    </PageContainer>
  );
};

export default ListComputeSGRulePage;
