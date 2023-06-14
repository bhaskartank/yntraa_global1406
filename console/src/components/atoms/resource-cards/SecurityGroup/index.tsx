import { Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import ResourceCardWrapper from "../ResourceCardWrapper";

interface SecurityGroupCardProps {
  name?: string;
  rules?: any[];
  isActive?: boolean;
}

const SecurityGroupCard: FC<SecurityGroupCardProps> = ({ name, rules, isActive }) => {
  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack justifyContent="space-between" height="100%" gap={2}>
        <Stack>
          <Typography variant="body2">Name</Typography>
          <Typography fontWeight="bold">{name}</Typography>
        </Stack>

        <Stack>
          <Typography variant="body2">Rules</Typography>
          <Typography fontWeight="bold">{rules?.filter((rule) => rule?.status?.toLowerCase() === "active")?.length || "0"}</Typography>
        </Stack>
      </Stack>
    </ResourceCardWrapper>
  );
};

interface SecurityGroupCardListProps {
  selected: any;
  handleSelect: (securityGroup: any) => void;
  list?: any;
}

export const SecurityGroupCardList: FC<SecurityGroupCardListProps> = (props) => {
  const { selected, handleSelect, list } = props;

  return (
    <Grid container spacing={2}>
      {list?.map((securityGroup) => (
        <Grid item key={securityGroup?.id} xs={12} sm={6} md={4} lg={3} xl={2} onClick={() => handleSelect(securityGroup)}>
          <SecurityGroupCard
            key={securityGroup?.id}
            name={securityGroup?.security_group_name}
            rules={securityGroup?.security_group_rule_security_group}
            isActive={selected?.map((securityGroup) => securityGroup?.id)?.includes(securityGroup?.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SecurityGroupCard;
