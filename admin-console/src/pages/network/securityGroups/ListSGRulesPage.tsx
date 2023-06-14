import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

// import virtualMachinesRedux from "store/modules/virtualMachines";
import PageContainer from "components/layouts/Frame/PageContainer";
import ListSGRules from "components/templates/networks/securityGroups/ListSGRules";
import SGRulesDetailBar from "components/templates/networks/securityGroups/SGRulesDetailBar";

// import { useParams } from "react-router-dom";

const ListSGRulesPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { securityGroups }: { securityGroups: any } = routerState;
  const fetchSecurityGroupRules = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.securityGroupRules(payload));
    },
    [dispatch],
  );

  const exportSecurityGroupRules = useCallback(async () => {
    try {
      // return await dispatch(networksRedux.actions.exportSecurityGroupRules({ security_group_id: securityGroup?.id }));
      return await dispatch(networksRedux.actions.exportSecurityGroupRules());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Security Group Rules" breadcrumbs={[{ label: "Security Groups", to: "/networks/security-groups" }, { label: "Security Group Rules" }]}>
      <SGRulesDetailBar securityGroups={securityGroups} />
      <ListSGRules fetchSecurityGroupRules={fetchSecurityGroupRules} exportSecurityGroupRules={exportSecurityGroupRules} />
    </PageContainer>
  );
};

export default ListSGRulesPage;
