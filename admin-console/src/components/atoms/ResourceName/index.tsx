import { Box } from "@mui/material";

export interface ResourceNameProps {
  label: string;
  onClick?: any;
  customStyle?: any;
  noWrap?: boolean;
}

const ResourceName = (props: ResourceNameProps) => {
  const { label, onClick, customStyle = {}, noWrap = false } = props;

  return (
    <Box
      onClick={onClick}
      whiteSpace={noWrap ? "nowrap" : "normal"}
      sx={{
        ...(onClick ? { textDecoration: "underline", cursor: "pointer", color: "primary.main" } : {}),
        ...customStyle,
      }}
      component="span">
      {label}
    </Box>
  );
};

export default ResourceName;
