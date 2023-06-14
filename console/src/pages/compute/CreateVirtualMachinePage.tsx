import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import modalRedux from "store/modules/modal";
import virtualMachineRedux from "store/modules/virtual-machines";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateVirtualMachine from "components/templates/compute/CreateVirtualMachine";

import { appRoutes, pageTitles } from "utils/constants";

const CreateVirtualMachinePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createVirtualMachine = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Virtual Machine",
            description: "Are you sure you want to create this machine?",
            onConfirm: async () => {
              try {
                await dispatch(virtualMachineRedux.actions.createVirtualMachine(payload));
                navigate(appRoutes.COMPUTE);
              } catch (err) {
                console.error(err);
              }
            },
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const handleCancel = useCallback(() => {
    dispatch(
      modalRedux.actions.open({
        title: "Create Virtual Machine",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.COMPUTE),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_VIRTUAL_MACHINE}>
      <CreateVirtualMachine onSubmit={createVirtualMachine} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateVirtualMachinePage;
