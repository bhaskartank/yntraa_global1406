import { Box, Stack } from "@mui/material";
import moment from "moment";

export function formatDate(timestamp, multiline = true, displayString = false, unix = false) {
  if (!timestamp) return "";

  let dateFormat = "";
  let timeFormat = "";

  if (unix) {
    timestamp = moment(timestamp)?.unix();
  }

  dateFormat = moment.unix(timestamp).format("DD-MMM-YYYY");
  timeFormat = moment.unix(timestamp).format("(hh:mm:ss A)");

  return displayString ? (
    `${dateFormat} ${timeFormat}`
  ) : (
    <Stack component="span" direction={multiline ? "column" : "row"} spacing={multiline ? 0 : 0.5}>
      <Box sx={{ whiteSpace: "nowrap" }}>{dateFormat}</Box>
      <Box sx={{ whiteSpace: "nowrap" }}>{timeFormat}</Box>
    </Stack>
  );
}
