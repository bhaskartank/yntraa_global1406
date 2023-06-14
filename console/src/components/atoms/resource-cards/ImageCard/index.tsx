import { Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import LinuxImage from "assets/images/operating-system/linux.png";

import ResourceCardWrapper from "../ResourceCardWrapper";

interface ImageCardProps {
  isActive: boolean;
  name?: string;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { isActive, name } = props;

  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack justifyContent="space-between" alignItems="center" height="100%" gap={2}>
        <Typography textAlign="center">{name}</Typography>
        {/* TODO: Make the image icon dynamic */}
        <img src={LinuxImage} alt={name} height={80} width={80} />
      </Stack>
    </ResourceCardWrapper>
  );
};

interface ImageCardListProps {
  selected: any;
  handleSelect: (image: any) => void;
  list?: any;
  isSnapshot?: boolean;
}

export const ImageCardList: FC<ImageCardListProps> = (props) => {
  const { selected, handleSelect, list, isSnapshot = false } = props;

  return (
    <Grid container spacing={2}>
      {list?.map((image) => (
        <Grid item key={image?.id} xs={12} sm={6} md={3} lg={2} onClick={() => handleSelect(image)}>
          <ImageCard key={image?.id} name={isSnapshot ? image?.snapshot_name : image?.name} isActive={selected?.id === image?.id} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageCard;
