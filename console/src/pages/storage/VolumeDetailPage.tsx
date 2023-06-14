import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import volumeRedux from "store/modules/volumes";

import PageContainer from "components/layouts/Frame/PageContainer";
import VolumeDetail from "components/templates/storage/VolumeDetail";

import { pageTitles } from "utils/constants";

const VolumeDetailPage = () => {
  const { volumeId } = useParams();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const volumeById = volumeRedux.getters.volumeById(rootState);

  const fetchVolumeById = useCallback(() => {
    dispatch(volumeRedux.actions.volumeById(volumeId));
  }, [dispatch, volumeId]);

  useEffect(() => {
    fetchVolumeById();
  }, [fetchVolumeById]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_VOLUME_DETAIL} hideTitle>
      <VolumeDetail volume={volumeById} />
    </PageContainer>
  );
};

export default VolumeDetailPage;
