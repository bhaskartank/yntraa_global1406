import { Box, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";

import { ImageCardList } from "components/atoms/resource-cards/ImageCard";
import TabBox from "components/molecules/TabBox";

interface ImageProps {
  images: any[];
  snapshots: any[];
  selectedImage: any;
  handleSelectImage: any;
}

const Image: FC<ImageProps> = ({ images, snapshots, selectedImage, handleSelectImage }) => {
  const [publicImages, privateImages] = useMemo(() => {
    const imageList = { public: [], private: [] };

    images?.filter((image) => image?.is_active)?.forEach((image) => (image?.public ? imageList?.public?.push(image) : imageList?.private?.push(image)));

    return [imageList?.public, imageList?.private];
  }, [images]);

  const snapshotImages = useMemo(() => {
    return snapshots?.filter((snapshot: any) => snapshot?.is_active && snapshot?.is_image);
  }, [snapshots]);

  const tabs = useMemo(() => {
    return [
      {
        title: "Snapshot Images",
        content: snapshotImages?.length ? <ImageCardList list={snapshotImages} selected={selectedImage} handleSelect={handleSelectImage} isSnapshot /> : null,
      },
      {
        title: "Public Images",
        content: publicImages?.length ? <ImageCardList list={publicImages} selected={selectedImage} handleSelect={handleSelectImage} /> : null,
      },
      {
        title: "Private Images",
        content: privateImages?.length ? <ImageCardList list={privateImages} selected={selectedImage} handleSelect={handleSelectImage} /> : null,
      },
    ];
  }, [handleSelectImage, privateImages, publicImages, selectedImage, snapshotImages]);

  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="subtitle1">Choose an Image</Typography>
        <Typography>
          Image refers to a pre-configured snapshot or template of a virtual machine, including the operating system and any pre-installed software, used for creating new virtual
          servers.
        </Typography>
      </Box>

      <TabBox tabs={tabs} variant="contained" />
    </Stack>
  );
};

export default Image;
