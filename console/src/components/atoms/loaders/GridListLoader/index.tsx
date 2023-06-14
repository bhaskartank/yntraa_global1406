import { Divider, Grid, Skeleton, Stack } from "@mui/material";

const GridListLoader = () => {
  return (
    <Stack direction="row" spacing={3} divider={<Divider flexItem orientation="vertical" />}>
      <Stack flex={1} gap={2}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={5}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={4}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={6}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={8}>
            <Skeleton />
          </Grid>
        </Grid>
      </Stack>
      <Stack flex={1} gap={2}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={5}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={4}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={6}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Skeleton />
          </Grid>
          <Grid item xs={8}>
            <Skeleton />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default GridListLoader;
