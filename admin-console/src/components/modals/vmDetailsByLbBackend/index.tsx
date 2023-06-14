import React from "react";

import { useDispatch, useSelector } from "store";
import modalRedux from "store/modules/modals";
import virtualMachinesRedux from "store/modules/virtualMachines";

import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ModalBox from "components/molecules/ModalBox";
import VirtualMachineDetails from "components/templates/compute/VirtualMachineDetails";

type VmDetailsByLbBackendProps = {
  modalTitle: string;
};

const VmDetailsByLbBackend: React.FC<VmDetailsByLbBackendProps> = ({ modalTitle }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const vmById = virtualMachinesRedux.getters.vmById(rootState);

  const isOpen = modalRedux.getters.vmDetailByLbBackend(rootState);

  const onClose = () => {
    dispatch(modalRedux.actions.vmDetailByLbBackend(false));
  };

  return (
    <ModalBox
      closeBtnCentered={true}
      closeBtnVariant={"contained"}
      title={modalTitle}
      isOpen={isOpen}
      onCancel={onClose}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", width: "fit-content", minWidth: "55vw" }}>
      <ComputeDetailBar compute={vmById} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0, width: "100%", display: "flex", flexWrap: "wrap" }} />
      <VirtualMachineDetails compute={vmById} />
    </ModalBox>
  );
};

export default VmDetailsByLbBackend;
