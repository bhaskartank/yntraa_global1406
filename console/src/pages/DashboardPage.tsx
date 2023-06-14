import PageContainer from "components/layouts/Frame/PageContainer";

import { pageTitles } from "utils/constants";

const DashboardPage = () => {
  return <PageContainer title={pageTitles?.PAGE_TITLE_DASHBOARD}></PageContainer>;
};

export default DashboardPage;
