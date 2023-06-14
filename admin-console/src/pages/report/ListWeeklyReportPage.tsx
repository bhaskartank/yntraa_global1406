import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";
import reportsRedux from "store/modules/reports";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListWeeklyReport from "components/templates/reports/ListWeeklyReport";

const ListWeeklyReportPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();

  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [selectedProviders, setSelectedProvider] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleProviderChange = useCallback(
    async (value: any) => {
      setSelectedProvider(value);
      setSelectedDate("");

      if (value?.length) {
        const availableDates = await dispatch(reportsRedux.actions.availableDates({ provider_id: value }));
        setAvailableDates(availableDates);
      } else {
        setAvailableDates([]);
      }
    },
    [dispatch],
  );

  const handleDateChange = useCallback(async (value: any) => {
    setSelectedDate(value);
  }, []);

  const fetchWeeklyReport = useCallback(() => {
    const payload = {
      log_date: selectedDate,
      provider_id: selectedProviders,
    };

    dispatch(reportsRedux.actions.weeklyReport(payload));
  }, [dispatch, selectedDate, selectedProviders]);

  const exportWeeklyReport = useCallback(
    async (providerId) => {
      try {
        return await dispatch(reportsRedux.actions.exportWeeklyReport(providerId));
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
    dispatch(reportsRedux.actions.reset());
  }, [dispatch]);

  return (
    <PageContainer title="Weekly Report" breadcrumbs={[{ label: "Weekly Report" }]}>
      <ListWeeklyReport
        fetchWeeklyReport={fetchWeeklyReport}
        exportWeeklyReport={exportWeeklyReport}
        handleProviderChange={handleProviderChange}
        availableDates={availableDates}
        selectedProviders={selectedProviders}
        handleDateChange={handleDateChange}
        selectedDate={selectedDate}
      />
    </PageContainer>
  );
};

export default ListWeeklyReportPage;
