import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import flavorRedux from "store/modules/flavors";
import modalRedux from "store/modules/modal";
import virtualMachineRedux from "store/modules/virtual-machines";

import { FormContainer } from "components/atoms/FormWrapper";
import { FlavorCardList } from "components/atoms/resource-cards/FlavorCard";

import { appRoutes } from "utils/constants";

interface ResizeProps {
  virtualMachine: any;
}

const Resize = ({ virtualMachine }: ResizeProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rootState = useSelector((state) => state);
  const flavors = flavorRedux.getters.flavors(rootState);

  const virtualMachineId = useMemo(() => virtualMachine?.id, [virtualMachine?.id]);

  const [selectedFlavour, setSelectedFlavour] = useState<any>(null);

  const handleSelectFlavor = useCallback(
    (flavor: any) => {
      setSelectedFlavour((current) => (current?.id === flavor?.id ? null : flavor));
    },
    [setSelectedFlavour],
  );

  const getFlavorList = useCallback(() => {
    dispatch(flavorRedux.actions.flavors({}));
  }, [dispatch]);

  const ResizeVirtualMachine = useCallback(async () => {
    try {
      await dispatch(
        modalRedux.actions.open({
          title: "Resize Virtual Machine",
          description: "Are you sure you want to resize this machine?",
          onConfirm: async () => {
            try {
              await dispatch(virtualMachineRedux.actions.resizeVirtualMachine({ computeId: virtualMachineId, flavorId: selectedFlavour?.id }));
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
  }, [dispatch, navigate, selectedFlavour?.id, virtualMachineId]);

  useEffect(() => {
    getFlavorList();
  }, [getFlavorList]);

  return (
    <FormContainer onCancel={() => navigate(appRoutes.COMPUTE)} onSubmit={ResizeVirtualMachine} submitDisabled={!selectedFlavour}>
      <Grid container direction="column">
        <Grid item xs={3} lg={3} md={4}>
          <FlavorCardList list={flavors?.list} handleSelect={(flavour) => handleSelectFlavor(flavour)} selected={selectedFlavour} />
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default Resize;
