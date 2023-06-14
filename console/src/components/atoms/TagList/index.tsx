import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

import { PlusIcon } from "assets/icons";

interface TagListProps {
  tags: any[];
  max?: number;
}

const TagList: FC<TagListProps> = ({ tags, max = 1 }) => {
  return tags?.length ? (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
      {tags?.slice(0, max).map((tag) => (
        <Chip key={tag} label={tag} />
      ))}

      {tags?.length - max > 0 ? (
        <Tooltip
          title={
            <Stack gap={1}>
              {tags?.slice(max).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </Stack>
          }>
          <Stack direction="row" alignItems="center">
            <PlusIcon width="14px" />
            <Typography>{tags?.length - max}</Typography>
          </Stack>
        </Tooltip>
      ) : null}
    </Stack>
  ) : null;
};

export default TagList;
