import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListImages from "components/templates/providers/images/ListImages";

const ListImagePage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchImages = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.images(payload));
    },
    [dispatch],
  );

  const exportImages = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportImages());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Images" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images" }]}>
      <ListImages fetchImages={fetchImages} exportImages={exportImages} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListImagePage;
