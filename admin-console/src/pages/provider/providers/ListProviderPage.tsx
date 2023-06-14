import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ManagePublicKeysModal from "components/templates/providers/ManagePublicKeysModal";
import ListProviders from "components/templates/providers/provider/ListProviders";

export const enum MODAL_TYPE {
  MANAGE_PUBLIC_KEYS = "MANAGE_PUBLIC_KEYS",
}

const ListProviderPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const publicKeys = providersRedux.getters.publicKeys(rootState);

  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => setActiveModal(null);

  const fetchProviders = useCallback(() => {
    dispatch(providersRedux.actions.providers());
  }, [dispatch]);

  const exportProviders = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportProviders());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const testConnection = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.testConnection(payload));
    },
    [dispatch],
  );

  const fetchPublicKeys = useCallback(
    async (providerId) => {
      try {
        await dispatch(providersRedux.actions.publicKeys(providerId, { status: "active" }));
        handleOpenModal(MODAL_TYPE.MANAGE_PUBLIC_KEYS);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const handleCreatePublicKey = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createPublickey(selectedProvider?.id, { ...payload, key_usability: "nks_controller" }));
        handleCloseModal();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, selectedProvider],
  );

  const syncImageWithHorizon = useCallback(
    (providerId) => {
      dispatch(providersRedux.actions.syncImageWithHorizon(providerId));
    },
    [dispatch],
  );

  const syncFlavorWithHorizon = useCallback(
    (providerId) => {
      dispatch(providersRedux.actions.syncFlavorWithHorizon(providerId));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Providers" breadcrumbs={[{ label: "Providers" }]}>
      <ListProviders
        fetchProviders={fetchProviders}
        exportProviders={exportProviders}
        testConnection={testConnection}
        setSelectedProvider={setSelectedProvider}
        fetchPublicKeys={fetchPublicKeys}
        syncImageWithHorizon={syncImageWithHorizon}
        syncFlavorWithHorizon={syncFlavorWithHorizon}
      />

      <ManagePublicKeysModal
        isOpen={activeModal === MODAL_TYPE.MANAGE_PUBLIC_KEYS}
        onClose={handleCloseModal}
        publicKeys={publicKeys}
        handleCreatePublicKey={handleCreatePublicKey}
      />
    </PageContainer>
  );
};

export default ListProviderPage;
