import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import publicIPRedux from "store/modules/public-ips";
import floatingIPRedux from "store/modules/floating-ips";
import gatewayRedux from "store/modules/gateway";
import loadBalancerRedux from "store/modules/load-balancers";
import networkRedux from "store/modules/networks";
import securityGroupRedux from "store/modules/security-groups";

import PageContainer from "components/layouts/Frame/PageContainer";
import TabBox from "components/molecules/TabBox";
import ListGateway from "components/templates/network/ListGateway";
import ListLoadBalancer from "components/templates/network/ListLoadBalancer";
import ListNetwork from "components/templates/network/ListNetwork";
import ListSecurityGroup from "components/templates/network/ListSecurityGroup";

import { pageTitles } from "utils/constants";
import ListFloatingIP from "components/templates/network/ListFloatingIP";
import ListPublicIP from "components/templates/network/ListPublicIP";

const ListNetworkPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const networks = networkRedux.getters.networks(rootState);
  const securityGroups = securityGroupRedux.getters.securityGroups(rootState);
  const gateway = gatewayRedux.getters.services(rootState);
  const loadBalancers = loadBalancerRedux.getters.loadBalancers(rootState);
  const floatingIPs = floatingIPRedux.getters.floatingIPs(rootState);
  const publicIPs = publicIPRedux.getters.listRequestedIps(rootState);

  const fetchNetworks = useCallback(
    async (payload) => {
      dispatch(networkRedux.actions.networks(payload));
    },
    [dispatch],
  );

  const fetchSecurityGroups = useCallback(
    async (payload) => {
      dispatch(securityGroupRedux.actions.securityGroups(payload));
    },
    [dispatch],
  );

  const fetchGateway = useCallback(
    async (payload) => {
      dispatch(gatewayRedux.actions.services(payload));
    },
    [dispatch],
  );

  const fetchLoadBalancers = useCallback(
    async (payload) => {
      dispatch(loadBalancerRedux.actions.loadBalancers(payload));
    },
    [dispatch],
  );

  const fetchFloatingIPs = useCallback(
    async (payload) => {
      dispatch(floatingIPRedux.actions.floatingIPs(payload));
    },
    [dispatch],
  );

  const fetchPublicIPs = useCallback(
    async (payload) => {
      dispatch(publicIPRedux.actions.listRequestedIps(payload));
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_NETWORK}>
      <TabBox
        tabs={[
          {
            title: pageTitles?.PAGE_TITLE_NETWORK_LIST,
            content: <ListNetwork list={networks?.list} totalRecords={networks?.totalRecords} fetchList={fetchNetworks} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_SECURITY_GROUP_LIST,
            content: <ListSecurityGroup list={securityGroups?.list} totalRecords={securityGroups?.totalRecords} fetchList={fetchSecurityGroups} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_GATEWAY_LIST,
            content: <ListGateway list={gateway?.list} totalRecords={gateway?.totalRecords} fetchList={fetchGateway} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_LOAD_BALANCER_LIST,
            content: <ListLoadBalancer list={loadBalancers?.list} totalRecords={loadBalancers?.totalRecords} fetchList={fetchLoadBalancers} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_FLOATING_IP_LIST,
            content: <ListFloatingIP list={floatingIPs?.list} totalRecords={floatingIPs?.totalRecords} fetchList={fetchFloatingIPs} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_PUBLIC_IP_LIST,
            content: <ListPublicIP list={publicIPs?.list} totalRecords={publicIPs?.totalRecords} fetchList={fetchPublicIPs} />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default ListNetworkPage;
