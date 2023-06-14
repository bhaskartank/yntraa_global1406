import { Box } from "@mui/material";

export interface ResourceNameProps {
  label: string;
  onClick?: any;
}

const ResourceName = (props: ResourceNameProps) => {
  const { label, onClick } = props;

  return (
    <Box
      onClick={onClick}
      sx={{
        fontWeight: "bold",
        ...(onClick ? { cursor: "pointer", color: "primary.main" } : {}),
      }}
      component="span">
      {label}
    </Box>
  );
};

export default ResourceName;
