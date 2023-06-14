import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface ProjectDetailBarProps {
  project: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const ProjectDetailBar: FC<ProjectDetailBarProps> = ({ project, type = "page", customStyle = {} }) => {
  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        color: "black",
        px: 1,
        whiteSpace: "pre-wrap",
        ...(type === "page" ? { backgroundColor: "primary.light", py: "4px", borderBottom: 0 } : { borderBottom: "1px solid black" }),
        ...customStyle,
      }}>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Project Name:
        </Typography>
        <StatusChip label={project?.name} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Project ID:
        </Typography>
        <StatusChip label={project?.project_id} color="info" />
      </Stack>
    </Stack>
  );
};

export default ProjectDetailBar;
