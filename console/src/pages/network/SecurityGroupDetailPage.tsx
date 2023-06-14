import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import securityGroupRuleRedux from "store/modules/security-group-rules";
import securityGroupRedux from "store/modules/security-groups";

import PageContainer from "components/layouts/Frame/PageContainer";
import SecurityGroupDetail from "components/templates/network/SecurityGroupDetail";

import { pageTitles } from "utils/constants";

const SecurityGroupDetailPage = () => {
  const { securityGroupId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const securityGroupById = securityGroupRedux.getters.securityGroupById(rootState);
  const securityGroupRules = securityGroupRuleRedux.getters.securityGroupRules(rootState);

  const fetchSecurityGroupRules = useCallback(
    (payload) => {
      dispatch(securityGroupRuleRedux.actions.securityGroupRules(securityGroupId, payload));
    },
    [dispatch, securityGroupId],
  );

  useEffect(() => {
    dispatch(securityGroupRedux.actions.securityGroupById(securityGroupId));
  }, [dispatch, securityGroupId]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_SECURITY_GROUP_DETAIL} hideTitle>
      <SecurityGroupDetail securityGroup={securityGroupById} fetchSecurityGroupRules={fetchSecurityGroupRules} securityGroupRules={securityGroupRules} />
    </PageContainer>
  );
};

export default SecurityGroupDetailPage;
