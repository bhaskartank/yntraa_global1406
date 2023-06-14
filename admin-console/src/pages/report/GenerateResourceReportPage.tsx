import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";
import reportsRedux from "store/modules/reports";

import PageContainer from "components/layouts/Frame/PageContainer";
import GenerateResourceReport from "components/templates/reports/ListWeeklyReport/GenerateResourceReport";

const ListWeeklyReportPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();

  const generateResourceReport = useCallback(
    async (payload, navigateBack = false) => {
      try {
        await dispatch(reportsRedux.actions.generateResourceReport(payload));

        if (navigateBack) {
          navigate("/reports/weekly-report");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer title="Generate Resource Report" breadcrumbs={[{ label: "Weekly Report", to: "/reports/weekly-report" }, { label: "Generate Resource Report" }]}>
      <GenerateResourceReport providers={providers?.list?.data || []} generateResourceReport={generateResourceReport} />
    </PageContainer>
  );
};

export default ListWeeklyReportPage;
