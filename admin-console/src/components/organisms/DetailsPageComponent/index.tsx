import { Divider, Stack } from "@mui/material";
import * as React from "react";

import { AccordionComp } from "components/molecules/AccordionComp";

import { DetailHeader, detailPageHeader } from "./DetailHeader";

interface DetailsPageProps {
  headerData: Array<detailPageHeader>;
  detailPageData?: any;
  isRequesting?: boolean;
  accordionData: {
    title: string;
    child: React.ReactNode;
  }[];
  actionButtons?: {
    label: string;
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    onClick?: (payload: any) => void;
  }[];
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
  multiStatusCheck?: any;
}

const DetailsPage = ({ headerData, accordionData, actionButtons, detailPageData, isRequesting, handleApproveReq, handleRejectReq, multiStatusCheck }: DetailsPageProps) => {
  return (
    <Stack sx={{ height: "100%", flex: 1 }} divider={<Divider />}>
      <DetailHeader headerData={headerData} />
      <AccordionComp
        actionButtons={actionButtons}
        accordionData={accordionData}
        isRequesting={isRequesting}
        detailPageData={detailPageData}
        handleApproveReq={handleApproveReq}
        handleRejectReq={handleRejectReq}
        multiStatusCheck={multiStatusCheck}
      />
    </Stack>
  );
};

export default DetailsPage;
