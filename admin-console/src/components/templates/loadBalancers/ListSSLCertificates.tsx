import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListSSLCertificateProps {
  fetchSSLCertificates: any;
  exportSSLCertificates: any;
  fetchLbSslCertificatesById: any;
}

const ListSSLCertificates: FC<ListSSLCertificateProps> = ({ fetchSSLCertificates, exportSSLCertificates, fetchLbSslCertificatesById }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const sslCertificates = loadBalancersRedux.getters.sslCertificates(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      { label: "Domain Name", filterKey: "domain", filters: sslCertificates?.list?.filter_values?.domain },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: sslCertificates?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: sslCertificates?.list?.filter_values?.provider_location },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        defaultHidden: true,
        filters: sslCertificates?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No",
        align: "center",
        filterKey: "org_reg_code",
        filters: sslCertificates?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        defaultHidden: true,
        filters: sslCertificates?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
      { label: "Expiry Date", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [sslCertificates?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Name",
      "Domain Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No",
      "Project Name",
      "Project ID",
      "Created",
      "Expiry Date",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "domain", label: "Domain Name" },
      { key: "project_name", label: "Project Name" },
      { key: "project_project_id", label: "Project ID" },
      { key: "organisation_name", label: "Organisation" },
      { key: "organisation_org_id", label: "Organisation ID" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider ID" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.domain },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.provider?.provider_name}</Box>
            <Box>({item?.provider?.provider_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.provider?.provider_description.split(" Location")[0].split(" ").pop(), align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.organisation?.name}</Box>
            <Box component="span">({item?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.name}</Box>
            <Box component="span">({item?.project?.project_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: formatDate(item?.created), align: "center" },
      { content: formatDate(item?.expiry_date), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.domain,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      formatDate(item?.created, false, true),
      formatDate(item?.expiry_date, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { sslCertificateDetail: item } }),
    },
    // {
    //   label: () => "View Certificates",
    //   onClick: (item) => fetchLbSslCertificatesById(item),
    // },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["SSL Certificate"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSSLCertificates({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchSSLCertificates],
  );

  const dataList = useDataList({
    data: sslCertificates?.list?.data || [],
    totalRecords: sslCertificates?.totalRecords,
    columns,
    actions,
    exportFilename: "SSL Requests List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportSSLCertificates,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSSLCertificates;
