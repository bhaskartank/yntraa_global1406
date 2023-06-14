import { Divider, Stack } from "@mui/material";
import { FC, ReactNode } from "react";

interface ResourceCardWrapperProps {
  children: ReactNode;
  isActive?: boolean;
}

const ResourceCardWrapper: FC<ResourceCardWrapperProps> = ({ children, isActive = false }) => {
  return (
    <Stack
      justifyContent="space-between"
      p={2}
      gap={2}
      divider={<Divider />}
      sx={{
        border: "1px solid",
        borderRadius: "4px",
        cursor: "pointer",
        borderColor: "grey.600",
        backgroundColor: "background.paper",
        height: "100%",
        img: { filter: "grayscale(100%)" },
        ":hover": { borderColor: "primary.main", img: { filter: "grayscale(0)" } },
        ...(isActive
          ? {
              borderColor: "primary.main",
              backgroundColor: "primary.light",
              img: { filter: "grayscale(0)" },
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }
          : {}),
      }}>
      {children}
    </Stack>
  );
};

export default ResourceCardWrapper;
