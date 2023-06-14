import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "store";
import modalRedux from "store/modules/modals";

import ModalBox from "components/molecules/ModalBox";
import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";

import ModalInnerComponent from "../commonComponent/ModalInnerComponent";
import ModalInnerField from "../commonComponent/ModalInnerField";

type ResourseOwnerDetailProps = {
  modalTitle: string;
};

const ResourseOwnerDetail: React.FC<ResourseOwnerDetailProps> = ({ modalTitle }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const resourceOwnerDetail = modalRedux.getters.resourceOwnerDetail(rootState);

  const isOpen = Boolean(resourceOwnerDetail);

  const onClose = () => {
    dispatch(modalRedux.actions.resourceOwnerDetail(null));
  };

  const columns: any = useMemo(() => {
    return [{ label: "User's Name" }, { label: "User's Email" }, { label: "Mobile" }];
  }, []);

  const rowCreator: any = useCallback((item: any) => [{ content: item?.first_name }, { content: item?.email }, { content: item?.mobile_no }], []);

  const dataList = useDataList({
    data: resourceOwnerDetail?.user_details || [],
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "180px",
  });

  return (
    <ModalBox
      closeBtnCentered={true}
      closeBtnVariant={"contained"}
      title={modalTitle}
      isOpen={isOpen}
      onCancel={onClose}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", width: "55vw" }}>
      {resourceOwnerDetail?.resource_details ? (
        <ModalInnerComponent title={"Resource Details"}>
          {resourceOwnerDetail?.resource_details &&
            Object.keys(resourceOwnerDetail?.resource_details)?.map((item) => <ModalInnerField key={item} label={item} value={resourceOwnerDetail?.resource_details[item]} />)}
        </ModalInnerComponent>
      ) : null}
      <ModalInnerComponent title={"Organization Details"}>
        <ModalInnerField label="Name" value={resourceOwnerDetail?.organisation_details?.name} />
        <ModalInnerField label="Organization ID" value={resourceOwnerDetail?.organisation_details?.org_id} />
        <ModalInnerField label="Description" value={resourceOwnerDetail?.organisation_details?.description} />
      </ModalInnerComponent>
      <ModalInnerComponent title={"Project Details"}>
        <ModalInnerField label="Name" value={resourceOwnerDetail?.project_details?.name} />
        <ModalInnerField label="Project ID" value={resourceOwnerDetail?.project_details?.project_id} />
        <ModalInnerField label="Description" value={resourceOwnerDetail?.project_details?.description} />
      </ModalInnerComponent>
      <ModalInnerComponent title={"User Listing"}>
        {/* <Box sx={{ width: "100%", maxHeight: "200px", overflowY: "auto" }}> */}
        <DataList dataList={dataList} hideActionBar={false} />
        {/* </Box> */}
      </ModalInnerComponent>
    </ModalBox>
  );
};

export default ResourseOwnerDetail;
