import { Box, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";

import { FlavorCardList } from "components/atoms/resource-cards/FlavorCard";
import TabBox from "components/molecules/TabBox";

interface FlavorProps {
  flavors: any[];
  selectedFlavor: any;
  handleSelectFlavor: (flavor: any) => void;
}

const Flavor: FC<FlavorProps> = ({ flavors, selectedFlavor, handleSelectFlavor }) => {
  const [allFlavors, smallFlavors, mediumFlavors, largeFlavors] = useMemo(() => {
    const flavorList = { all: [], small: [], medium: [], large: [] };

    flavors?.forEach((flavor) => {
      flavorList?.all?.push(flavor);

      if (flavor?.weight <= 500) flavorList?.small?.push(flavor);
      else if (flavor?.weight > 500 && flavor?.weight <= 1100) flavorList?.medium?.push(flavor);
      else if (flavor?.weight > 1100) flavorList?.large?.push(flavor);
    });

    return [flavorList?.all, flavorList?.small, flavorList?.medium, flavorList?.large];
  }, [flavors]);

  const tabs = useMemo(() => {
    return [
      {
        title: "All",
        content: allFlavors?.length ? <FlavorCardList list={allFlavors} selected={selectedFlavor} handleSelect={handleSelectFlavor} /> : null,
      },
      {
        title: "Small",
        content: smallFlavors?.length ? <FlavorCardList list={smallFlavors} selected={selectedFlavor} handleSelect={handleSelectFlavor} /> : null,
      },
      {
        title: "Medium",
        content: mediumFlavors?.length ? <FlavorCardList list={mediumFlavors} selected={selectedFlavor} handleSelect={handleSelectFlavor} /> : null,
      },
      {
        title: "Large",
        content: largeFlavors?.length ? <FlavorCardList list={largeFlavors} selected={selectedFlavor} handleSelect={handleSelectFlavor} /> : null,
      },
    ];
  }, [allFlavors, handleSelectFlavor, largeFlavors, mediumFlavors, selectedFlavor, smallFlavors]);

  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="subtitle1">Choose Flavor</Typography>
        <Typography>
          A flavor refers to a predefined combination of virtual machine specifications, including CPU, memory, and storage, for deploying and running applications in their cloud
          infrastructure.
        </Typography>
      </Box>

      <TabBox tabs={tabs} variant="contained" />
    </Stack>
  );
};

export default Flavor;
