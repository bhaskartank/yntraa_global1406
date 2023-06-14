import { Button, Card, Stack, Typography } from "@mui/material";
import { FC } from "react";

interface CloudSubscriptionProps {
  handleOpenEulaModal: () => void;
}

const CloudSubscription: FC<CloudSubscriptionProps> = ({ handleOpenEulaModal }) => {
  return (
    <Card sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <Typography variant="h6">Ready to get started?</Typography>

          <Typography>Ready to embark on your cloud journey. Subscribe now and gain access to our diverse range of cloud services!</Typography>
        </Stack>

        <Button variant="contained" onClick={handleOpenEulaModal} sx={{ fontSize: "16px" }}>
          Subscribe Now
        </Button>
      </Stack>
    </Card>
  );
};

export default CloudSubscription;
