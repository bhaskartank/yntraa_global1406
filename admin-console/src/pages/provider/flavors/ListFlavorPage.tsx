import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListFlavors from "components/templates/providers/flavors/ListFlavors";

const ListFlavorPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchFlavors = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.flavors(payload));
    },
    [dispatch],
  );

  const exportFlavors = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportFlavors());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Flavors" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Flavors" }]}>
      <ListFlavors fetchFlavors={fetchFlavors} exportFlavors={exportFlavors} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListFlavorPage;
