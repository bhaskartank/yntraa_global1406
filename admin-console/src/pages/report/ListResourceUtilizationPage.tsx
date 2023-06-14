import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";
import reportsRedux from "store/modules/reports";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListResourceUtilization from "components/templates/reports/ListResourceUtilization";

const ListResourceUtilizationPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();

  const [date, setDate] = useState<Date | null>(moment()?.subtract(1, "days")?.toDate());
  const [selectedProvider, setSelectedProvider] = useState<string>(null);
  const [reportType, setReportType] = useState<string>(null);

  const handleProviderChange = useCallback((value: string | number) => setSelectedProvider(value as string), []);
  const handleReportTypeChange = useCallback((value: string | number) => setReportType(value as string), []);

  const fetchResourceUtilization = useCallback(
    (payload) => {
      dispatch(reportsRedux.actions.resourceUtilization(selectedProvider, { ...payload, limit: 100 }));
    },
    [dispatch, selectedProvider],
  );

  const exportResourceUtilization = useCallback(
    async (providerId) => {
      try {
        return await dispatch(reportsRedux.actions.exportResourceUtilization(providerId));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  useEffect(() => {
    if (routerState?.providerId) setSelectedProvider(String(routerState?.providerId));
  }, [routerState]);

  useEffect(() => {
    dispatch(reportsRedux.actions.reset());
  }, [dispatch]);

  return (
    <PageContainer title="Resource Utilization" breadcrumbs={[{ label: "Resource Utilization" }]}>
      <ListResourceUtilization
        fetchResourceUtilization={fetchResourceUtilization}
        exportResourceUtilization={exportResourceUtilization}
        handleProviderChange={handleProviderChange}
        selectedProvider={selectedProvider}
        handleDateChange={setDate}
        date={date}
        handleReportTypeChange={handleReportTypeChange}
        reportType={reportType}
      />
    </PageContainer>
  );
};

export default ListResourceUtilizationPage;
