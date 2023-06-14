import { Box, Button, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { DetailPageArrow } from "icons";
import * as React from "react";
import { CgArrowDown, CgArrowUp } from "react-icons/cg";

interface AccordionType {
  title: string;
  child: React.ReactNode;
}

export interface ActionButtons {
  label: string;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  onClick?: (payload: any) => void;
}

interface AccordionCompProps {
  accordionData: Array<AccordionType>;
  actionButtons?: Array<ActionButtons>;
  isRequesting?: boolean;
  detailPageData?: any;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
  multiStatusCheck?: any;
}

export const AccordionComp = ({
  accordionData,
  actionButtons,
  isRequesting = false,
  detailPageData,
  handleRejectReq,
  handleApproveReq,
  multiStatusCheck = null,
}: AccordionCompProps) => {
  const [expandedState, setExpandedState] = React.useState<string[]>([]);
  const [expandAllIcon, setExpandIcon] = React.useState<boolean>(false);
  const [collapseAllIcon, setCollapseAllIcon] = React.useState<boolean>(true);

  const handleChange = (panel: string) => () => {
    setExpandedState((current) => (current?.includes(panel) ? current?.filter((item) => item !== panel) : [...current, panel]));
  };

  const expandAll = () => {
    setExpandedState(accordionData?.map((item) => item?.title));
    setExpandIcon(true);
    setCollapseAllIcon(false);
  };

  const collapseAll = () => {
    setExpandedState([]);
    setCollapseAllIcon(true);
    setExpandIcon(false);
  };

  React.useEffect(() => {
    if (expandedState.length === 0) {
      setCollapseAllIcon(true);
      setExpandIcon(false);
    } else if (expandedState.length > 0) {
      if (accordionData.length === expandedState.length) {
        setExpandIcon(true);
        setCollapseAllIcon(false);
      }
    }
  }, [accordionData.length, expandedState.length]);

  return (
    <Stack flex={1} overflow="hidden">
      <Stack direction="row" justifyContent="space-between" py={1}>
        <Stack direction="row" px={2} gap={1}>
          {actionButtons?.length > 0 &&
            actionButtons.map((btnData, index) => {
              return (
                <Button
                  onClick={btnData?.onClick}
                  key={index}
                  size="small"
                  color={btnData?.color ? btnData.color : "primary"}
                  variant={btnData?.variant ? btnData.variant : "contained"}>
                  {btnData?.label}
                </Button>
              );
            })}
        </Stack>
        <Stack>
          {accordionData.length > 0 ? (
            <Stack direction="row" justifyContent="flex-end">
              <Button disabled={expandAllIcon} endIcon={<CgArrowDown />} sx={{ color: "primary.darker" }} variant="text" onClick={expandAll}>
                Expand all
              </Button>
              <Button disabled={collapseAllIcon} endIcon={<CgArrowUp />} sx={{ color: "primary.darker" }} variant="text" onClick={collapseAll}>
                Collapse all
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
      <Stack
        sx={{ overflowY: "auto", flex: 1 }}
        // height={isRequesting && multiStatusCheck === null && detailPageData?.status.toLowerCase() === "pending" ? 440 : 450}
        mb={1}>
        {accordionData?.map((item, index) => {
          return (
            <Accordion
              key={index}
              expanded={expandedState.includes(item?.title)}
              onChange={handleChange(item?.title as string)}
              sx={{
                "&.Mui-expanded": { my: 0 },
                ".MuiAccordionSummary-root": {
                  minHeight: 0,
                  height: "48px",
                },
              }}>
              <AccordionSummary expandIcon={<DetailPageArrow />} aria-controls="panel1bh-content" id="panel1bh-header" sx={{ backgroundColor: "grey.500", width: "100%" }}>
                <Typography color="text" variant="subtitle1" sx={{ width: "100%", flexShrink: 0 }}>
                  {item?.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box px={2}>{item?.child}</Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
      <Box px={3} py={1}>
        {isRequesting && multiStatusCheck === null && detailPageData?.status.toLowerCase() === "pending" && (
          <Stack gap={2} direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={handleRejectReq}>
              Reject
            </Button>
            <Button variant="contained" onClick={handleApproveReq}>
              Approve
            </Button>
          </Stack>
        )}
        {multiStatusCheck ? multiStatusCheck() : null}
      </Box>
    </Stack>
  );
};
