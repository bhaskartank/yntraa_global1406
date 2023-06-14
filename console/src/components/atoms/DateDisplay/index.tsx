import { Stack, Typography } from "@mui/material";
import moment from "moment";
import { FC } from "react";

import { DateIcon, TimeIcon } from "assets/icons";

interface DateDisplayProps {
  datetime: number;
}

const DateDisplay: FC<DateDisplayProps> = ({ datetime }) => {
  if (!datetime) {
    return <></>;
  }

  let date = "";
  let time = "";

  date = moment.unix(datetime).format("DD-MMM-YYYY");
  time = moment.unix(datetime).format("hh:mm:ss a");

  return (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
      <Stack direction="row" alignItems="center" gap={"4px"}>
        <Stack alignItems="center" justifyContent="center" sx={{ color: "info.main" }} width="14px">
          <DateIcon />
        </Stack>
        <Typography noWrap>{date}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={"4px"}>
        <Stack alignItems="center" justifyContent="center" sx={{ color: "info.main" }} width="14px">
          <TimeIcon />
        </Stack>
        <Typography noWrap>{time}</Typography>
      </Stack>
    </Stack>
  );
};

export default DateDisplay;
