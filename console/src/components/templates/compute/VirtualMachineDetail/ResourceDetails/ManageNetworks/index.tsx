import { Grid } from "@mui/material";
import get from "lodash/get";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "store";
import networksRedux from "store/modules/networks";
import virtualMachineRedux from "store/modules/virtual-machines";

import { Network } from "./Network";
import { Subnets } from "./Subnets";

interface ManageNetworksProps {
  virtualMachine: any;
}

const ManageNetworks: React.FunctionComponent<ManageNetworksProps> = ({ virtualMachine }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const virtualMachineById = virtualMachineRedux.getters.virtualMachineById(rootState);
  const networks = networksRedux.getters.networks(rootState);

  const [appliedNetworks, setAppliedNetworks] = useState<any[]>([]);
  const [unappliedNetworks, setUnappliedNetworks] = useState<any[]>([]);
  const [subnets, setSubnets] = useState<any[]>([]);

  const virtualMachineId = useMemo(() => virtualMachine?.id, [virtualMachine?.id]);

  const filterSubnet = useCallback((networks) => {
    const list = [];

    for (let i = 0; i < networks?.length; i++) {
      const subnetNetwork = networks[i];
      let obj: any = {};

      for (let j = 0; j < subnetNetwork?.subnets?.length; j++) {
        const subnet = subnetNetwork?.subnets[j];
        const { private_ip, network } = subnetNetwork;

        obj = { private_ip, network, network_address: subnet.network_address };

        list.push(obj);
      }
    }

    return list;
  }, []);

  const filterUnappliedNetworks = useCallback(
    (appliedNetworks) => {
      const appliedNetworkIds = appliedNetworks.map((network) => network?.network_id);
      const filteredNetwork = networks?.list?.filter((x) => !appliedNetworkIds.includes(x?.id) && x?.managed_by === "user").map((network) => ({ ...network, isUnapplied: true }));
      return filteredNetwork;
    },
    [networks],
  );

  const createMapping = useCallback(() => {
    const appliedNetworks = get(virtualMachineById, "compute_network_mapping", []);

    const modifiedAppliedNetworks = [];

    appliedNetworks.forEach((appliedNetwork) => {
      const subnets = networks?.list.filter((network) => network?.id === appliedNetwork?.network_id)?.map((network) => network?.subnet_network);

      modifiedAppliedNetworks.push({ ...appliedNetwork, subnets: subnets[0] });
    });

    setAppliedNetworks(modifiedAppliedNetworks);

    setUnappliedNetworks(filterUnappliedNetworks(modifiedAppliedNetworks));

    setSubnets(filterSubnet(modifiedAppliedNetworks));
  }, [filterSubnet, filterUnappliedNetworks, networks?.list, virtualMachineById]);

  const fetchVirtualMachineById = useCallback(() => {
    dispatch(virtualMachineRedux.actions.virtualMachineById(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchNetworks = useCallback(() => {
    dispatch(networksRedux.actions.networks({ external: false }));
  }, [dispatch]);

  const applyNetwork = useCallback(
    async (networkId) => {
      try {
        await dispatch(networksRedux.actions.attachNetwork({ compute_id: virtualMachineId, network_id: networkId }));
        fetchVirtualMachineById();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, fetchVirtualMachineById, virtualMachineId],
  );

  const unapplyNetwork = useCallback(
    async (networkId) => {
      try {
        await dispatch(networksRedux.actions.detachNetwork({ compute_id: virtualMachineId, network_id: networkId }));
        fetchVirtualMachineById();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, fetchVirtualMachineById, virtualMachineId],
  );

  useEffect(() => {
    fetchVirtualMachineById();
    fetchNetworks();
  }, [fetchVirtualMachineById, fetchNetworks]);

  useEffect(() => {
    createMapping();
  }, [createMapping]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Network appliedNetworks={appliedNetworks} unappliedNetworks={unappliedNetworks} applyNetwork={applyNetwork} unapplyNetwork={unapplyNetwork} />
      </Grid>
      <Grid item xs={12} md={7}>
        <Subnets data={subnets} />
      </Grid>
    </Grid>
  );
};

export default ManageNetworks;
