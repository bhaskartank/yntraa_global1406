import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListSecurityGroups from "components/templates/networks/securityGroups/ListSecurityGroupRules";

const ListSecurityGroupPage = () => {
  const dispatch = useDispatch();

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

  return (
    <PageContainer title="Security Groups Rules" breadcrumbs={[{ label: "Security Groups" }]}>
      <ListSecurityGroups fetchSecurityGroupRules={fetchSecurityGroupRules} exportSecurityGroupRules={exportSecurityGroupRules} />
    </PageContainer>
  );
};

export default ListSecurityGroupPage;
