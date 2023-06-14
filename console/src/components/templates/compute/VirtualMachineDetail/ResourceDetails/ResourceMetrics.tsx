import { Button, ButtonGroup, Grid, Stack } from "@mui/material";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import ControlledSelect from "components/molecules/ControlledSelect";

const RESOURCE_TYPES = [
  { label: "Disk", type: "Storage" },
  { label: "Network", type: "Network" },
];

interface ResourceMetricsProps {
  virtualMachine: any;
  fetchResourceMetrics: (payload: any) => any;
  fetchUsageGraph: (payload: any) => any;
}

const ResourceMetrics: FC<ResourceMetricsProps> = ({ virtualMachine, fetchResourceMetrics, fetchUsageGraph }) => {
  const [selectedDuration, setSelectedDuration] = useState<any>("1800");
  const [resourceType, setResourceType] = useState<string>(RESOURCE_TYPES[0]?.type);
  const [labels, setLabels] = useState<any>({ cpu: [], storage: [], network: [] });
  const [resources, setResources] = useState<any>({ cpu: [], storage: [], network: [] });
  const [chartData, setChartData] = useState<any[]>([
    {
      options: {
        chart: { id: "chart-one" },
        xaxis: {
          categories: [],
          tickPlacement: "between",
          title: {
            text: "x-axis",
            offsetY: 40,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "y-axis",
          },
        },
        title: {
          text: "",
          align: "center",
          offsetX: 35,
        },
      },
      series: [{ name: "series", data: [] }],
    },
    {
      options: {
        chart: { id: "chart-two" },
        xaxis: {
          categories: [],
          tickPlacement: "between",
          title: {
            text: "x-axis",
            offsetY: 40,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "y-axis",
          },
        },
        title: {
          text: "",
          align: "center",
          offsetX: 35,
        },
      },
      series: [{ name: "series", data: [] }],
    },
    {
      options: {
        chart: { id: "chart-three" },
        xaxis: {
          categories: [],
          tickPlacement: "between",
          title: {
            text: "x-axis",
            offsetY: 40,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "y-axis",
          },
        },
        title: {
          text: "",
          align: "center",
          offsetX: 35,
        },
      },
      series: [{ name: "series", data: [] }],
    },
    {
      options: {
        chart: { id: "chart-four" },
        xaxis: {
          categories: [],
          tickPlacement: "between",
          title: {
            text: "x-axis",
            offsetY: 40,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "y-axis",
          },
        },
        title: {
          text: "",
          align: "center",
          offsetX: 35,
        },
      },
      series: [{ name: "series", data: [] }],
    },
  ]);

  const handleChangeDuration = useCallback((value) => {
    setSelectedDuration(value);
  }, []);

  const getDurationInterval = (duration: string) => {
    const from = moment().subtract(duration, "seconds").format("YYYY-MM-DD HH:mm:ss");
    const to = moment().format("YYYY-MM-DD HH:mm:ss");

    return { from, to };
  };

  const mapAxisLabels = useCallback(
    (resourceType, label) => {
      const axisLabels = { xaxis: "", yaxis: "" };
      resources[resourceType?.toLowerCase()]?.forEach((item) => {
        if (item?.report_label === label) {
          axisLabels.xaxis = item?.x_label;
          axisLabels.yaxis = item?.y_label;
        }
      });
      return axisLabels;
    },
    [resources],
  );

  const prepareGraph = useCallback(
    (responses, labels, resourceType) => {
      const chartData1 = { labels: null, datasets: [{ data: null, label: null }] };
      const chartData2 = { labels: null, datasets: [{ data: null, label: null }] };
      const chartData3 = { labels: null, datasets: [{ data: null, label: null }] };
      const chartData4 = { labels: null, datasets: [{ data: null, label: null }] };

      if (responses?.length && responses[0]?.data && responses[0]?.data && responses[0]?.data?.result[0]) {
        chartData1.labels = responses[0]?.data?.result[0]?.values?.map((item) => new Date(item[0] * 1000)?.toLocaleString());
        chartData1.datasets[0].data = responses[0]?.data?.result[0]?.values?.map((item) => Math.round(item[1]));
        chartData1.datasets[0].label = labels[0];
      } else {
        return;
      }
      if (responses?.length && responses[1]?.data && responses[1]?.data && responses[1]?.data?.result[0]) {
        chartData2.labels = responses[1]?.data?.result[0]?.values?.map((item) => new Date(item[0] * 1000)?.toLocaleString());
        chartData2.datasets[0].data = responses[1]?.data?.result[0]?.values?.map((item) => parseFloat(item[1])?.toFixed(2));
        chartData2.datasets[0].label = labels[1];
      } else {
        return;
      }
      if (responses?.length && responses[2]?.data && responses[2]?.data && responses[2]?.data?.result[0]) {
        chartData3.labels = responses[2]?.data?.result[0]?.values?.map((item) => new Date(item[0] * 1000)?.toLocaleString());
        chartData3.datasets[0].data = responses[2]?.data?.result[0]?.values?.map((item) => parseFloat(item[1])?.toFixed(2));
        chartData3.datasets[0].label = labels[2];
      } else {
        return;
      }
      if (responses?.length && responses[3]?.data && responses[3]?.data && responses[3]?.data?.result[0]) {
        chartData4.labels = responses[3]?.data?.result[0]?.values?.map((item) => new Date(item[0] * 1000)?.toLocaleString());
        chartData4.datasets[0].data = responses[3]?.data?.result[0]?.values?.map((item) => parseFloat(item[1]).toFixed(2));
        chartData4.datasets[0].label = labels[3];
      } else {
        return;
      }

      setChartData([
        {
          options: {
            ...chartData[0]?.options,
            xaxis: {
              ...chartData[0]?.options?.xaxis,
              categories: chartData1?.labels,
              title: { text: mapAxisLabels(resourceType, labels[0])?.xaxis, offsetY: 80 },
            },
            yaxis: { ...chartData[0]?.options?.yaxis, title: { text: mapAxisLabels(resourceType, labels[0])?.yaxis } },
            title: { ...chartData[0]?.title, text: labels[0] },
          },
          series: [{ name: chartData1?.datasets[0]?.label, data: chartData1?.datasets[0]?.data }],
        },
        {
          options: {
            ...chartData[1]?.options,
            xaxis: {
              ...chartData[1]?.options?.xaxis,
              categories: chartData2?.labels,
              title: { text: mapAxisLabels(resourceType, labels[1])?.xaxis, offsetY: 80 },
            },
            yaxis: { ...chartData[1]?.options?.yaxis, title: { text: mapAxisLabels(resourceType, labels[1])?.yaxis } },
            title: { ...chartData[1]?.title, text: labels[1] },
          },
          series: [{ name: chartData2?.datasets[0]?.label, data: chartData2?.datasets[0]?.data }],
        },
        {
          options: {
            ...chartData[2]?.options,
            xaxis: {
              ...chartData[2]?.options?.xaxis,
              categories: chartData3?.labels,
              title: { text: mapAxisLabels(resourceType, labels[2])?.xaxis, offsetY: 80 },
            },
            yaxis: { ...chartData[2]?.options?.yaxis, title: { text: mapAxisLabels(resourceType, labels[2])?.yaxis } },
            title: { ...chartData[2]?.title, text: labels[2] },
          },
          series: [{ name: chartData3?.datasets[0]?.label, data: chartData3?.datasets[0]?.data }],
        },
        {
          options: {
            ...chartData[3]?.options,
            xaxis: {
              ...chartData[3]?.options?.xaxis,
              categories: chartData4?.labels,
              title: { text: mapAxisLabels(resourceType, labels[3])?.xaxis, offsetY: 80 },
            },
            yaxis: { ...chartData[3]?.options.yaxis, title: { text: mapAxisLabels(resourceType, labels[3])?.yaxis } },
            title: { ...chartData[3]?.title, text: labels[3] },
          },
          series: [{ name: chartData4?.datasets[0]?.label, data: chartData4?.datasets[0]?.data }],
        },
      ]);
    },
    [chartData, mapAxisLabels],
  );

  const renderStats = useCallback(
    async (labels) => {
      try {
        const selectedLabel = resourceType === "CPU" ? labels?.cpu : resourceType === "Storage" ? labels?.storage : resourceType === "Network" ? labels?.network : null;

        const { from, to } = getDurationInterval(selectedDuration);

        if (selectedLabel?.length && virtualMachine) {
          const payload = {
            response_type: "json",
            from_date: from,
            to_date: to,
            steps: parseInt(selectedDuration) / 10,
            computeId: virtualMachine?.id,
          };

          const responses = await Promise.all([
            fetchUsageGraph({ ...payload, report_label: selectedLabel[0] }),
            fetchUsageGraph({ ...payload, report_label: selectedLabel[1] }),
            fetchUsageGraph({ ...payload, report_label: selectedLabel[2] }),
            fetchUsageGraph({ ...payload, report_label: selectedLabel[3] }),
          ]);
          prepareGraph(responses, selectedLabel, resourceType);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [fetchUsageGraph, prepareGraph, resourceType, selectedDuration, virtualMachine],
  );

  const init = useCallback(async () => {
    try {
      const response = await fetchResourceMetrics({ metric_level: "instance" });

      const resources = { cpu: [], network: [], storage: [] };

      response.forEach((item) => {
        resources[item?.resource_type].push(item);
      });

      setResources(resources);

      const resourceLabels = response.map((item) => item?.report_label);

      const cpuLabels = [];
      const storageLabels = [];
      const networkLabels = [];

      resourceLabels.forEach((item) => {
        if (item?.includes("disk")) storageLabels.push(item);
        else if (item?.includes("network")) networkLabels.push(item);
        else cpuLabels?.push(item);
      });

      setLabels({ cpu: cpuLabels, storage: storageLabels, network: networkLabels });

      if (cpuLabels?.length && storageLabels?.length && networkLabels?.length) {
        renderStats({ cpu: cpuLabels, storage: storageLabels, network: networkLabels });
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchResourceMetrics, renderStats]);

  useEffect(() => {
    if (labels?.cpu?.length && labels?.storage?.length && labels?.network?.length && resources?.cpu?.length && resources?.storage?.length && resources?.network?.length)
      renderStats(labels);
  }, [labels, renderStats, resources]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mt={1}>
        <ButtonGroup variant="contained" aria-label="select resource type" size="small">
          {RESOURCE_TYPES.map(({ label, type }) => (
            <Button key={type} onClick={() => setResourceType(type)} size="small" variant={resourceType === type ? "outlined" : "contained"}>
              {label}
            </Button>
          ))}
        </ButtonGroup>
        <ControlledSelect
          value={selectedDuration}
          label="Select Duration"
          onChange={handleChangeDuration}
          list={[
            { label: "30 minutes", value: "1800" },
            { label: "1 hour", value: "3600" },
            { label: "6 hours", value: "21600" },
            { label: "1 day", value: "86400" },
            { label: "7 days", value: "604800" },
            { label: "15 days", value: "1296000" },
          ]}
          width={"140px"}
        />
      </Stack>

      <Grid container mt={"8px"} columnSpacing={4} rowSpacing={2}>
        <Grid item xs={12} md={6}>
          <ReactApexChart options={chartData[0]?.options} series={chartData[0]?.series} type="area" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReactApexChart options={chartData[1]?.options} series={chartData[1]?.series} type="area" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReactApexChart options={chartData[2]?.options} series={chartData[2]?.series} type="area" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReactApexChart options={chartData[3]?.options} series={chartData[3]?.series} type="area" />
        </Grid>
      </Grid>
    </>
  );
};

export default ResourceMetrics;
