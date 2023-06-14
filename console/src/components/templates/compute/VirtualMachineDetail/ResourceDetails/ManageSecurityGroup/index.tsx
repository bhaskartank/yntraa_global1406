import { Grid } from "@mui/material";
import get from "lodash/get";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "store";
import securityGroupRedux from "store/modules/security-groups";
import virtualMachineRedux from "store/modules/virtual-machines";

import { ApplicableSecurityRules } from "./ApplicableSecurityRules";
import { SecurityGroups } from "./SecurityGroups";

interface ManageSecurityGroupProps {
  virtualMachine: any;
}

export const ManageSecurityGroup: React.FunctionComponent<ManageSecurityGroupProps> = ({ virtualMachine }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const virtualMachineById = virtualMachineRedux.getters.virtualMachineById(rootState);
  const securityGroups = securityGroupRedux.getters.securityGroups(rootState);

  const [appliedSecurityGroups, setAppliedSecurityGroups] = useState<any[]>([]);
  const [unappliedSecurityGroups, setUnappliedSecurityGroups] = useState<any[]>([]);
  const [securityRules, setSecurityRules] = useState<any[]>([]);

  const virtualMachineId = useMemo(() => virtualMachine?.id, [virtualMachine?.id]);

  const filterUnappliedSecurityGroups = useCallback(
    (groups) => {
      const appliedSecurityGroupsId = groups.map((sg) => sg.id);

      return securityGroups?.list
        ?.filter((x) => {
          return !appliedSecurityGroupsId.includes(x.id) && x.managed_by === "user" && !x.is_gw_security_group && !x.is_lb_security_group;
        })
        .map((group) => ({ ...group, isUnapplied: true }));
    },
    [securityGroups?.list],
  );

  const filterSecurityRules = useCallback((groups) => {
    const list = [];
    for (let i = 0; i < groups.length; i++) {
      const sg = groups[i];
      let obj: any = {};
      for (let j = 0; j < sg.security_group_rule_security_group.length; j++) {
        const rule = sg.security_group_rule_security_group[j];
        const { direction, protocol, port_range_min, port_range_max, remote_ip_prefix } = rule;
        obj = {
          direction,
          protocol,
          port_range_min,
          port_range_max,
          remote_ip_prefix,
          security_group_name: sg?.security_group_name,
        };

        list.push(obj);
      }
    }
    return list;
  }, []);

  const createMapping = useCallback(() => {
    const groups = get(virtualMachineById, "compute_security_group_mapping", []).map((group) => group.security_group);
    setAppliedSecurityGroups(groups);
    setUnappliedSecurityGroups(filterUnappliedSecurityGroups(groups));
    setSecurityRules(filterSecurityRules(groups));
  }, [filterSecurityRules, filterUnappliedSecurityGroups, virtualMachineById]);

  const fetchVirtualMachineById = useCallback(() => {
    dispatch(virtualMachineRedux.actions.virtualMachineById(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchSecurityGroups = useCallback(() => {
    dispatch(securityGroupRedux.actions.securityGroups({ external: false }));
  }, [dispatch]);

  const applySecurityGroup = useCallback(
    async (securityGroupId) => {
      try {
        await dispatch(virtualMachineRedux.actions.attachSecurityGroup({ computeId: virtualMachineId, securityGroupId }));
        fetchVirtualMachineById();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, fetchVirtualMachineById, virtualMachineId],
  );

  const removeSecurityGroup = useCallback(
    async (securityGroupId) => {
      try {
        await dispatch(virtualMachineRedux.actions.detachSecurityGroup({ computeId: virtualMachineId, securityGroupId }));
        fetchVirtualMachineById();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, fetchVirtualMachineById, virtualMachineId],
  );

  useEffect(() => {
    fetchVirtualMachineById();
    fetchSecurityGroups();
  }, [fetchSecurityGroups, fetchVirtualMachineById]);

  useEffect(() => {
    createMapping();
  }, [createMapping]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <SecurityGroups
          appliedSecurityGroups={appliedSecurityGroups}
          unappliedSecurityGroups={unappliedSecurityGroups}
          applySecurityGroup={applySecurityGroup}
          removeSecurityGroup={removeSecurityGroup}
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <ApplicableSecurityRules data={securityRules} />
      </Grid>
    </Grid>
  );
};
