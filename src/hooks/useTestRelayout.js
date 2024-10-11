import { useRef, useState } from "react";
import { filterModelsByDateRange } from "../utils/helper";
import dayjs from "dayjs";
import { useDataContext } from "../context/DataContext";
import toast from "react-hot-toast";

export function useTestRelayout(baseLayout, baseData, setChartData) {
  const layoutRef = useRef(baseLayout);

  const { testData, setToggle } = useDataContext();

  const [chartLayout, setChartLayout] = useState(null);

  const modelsName = Object.keys(testData);
  const trueArray = new Array(modelsName.length).fill(true);

  const [legendVisibility, setLegendVisibility] = useState(trueArray);

  const handleLegendClick = (event) => {
    const traceIndex = event.curveNumber; // Get the index of the clicked trace
    const newVisibility = [...legendVisibility];
    newVisibility[traceIndex] = !newVisibility[traceIndex]; // Toggle visibility
    setLegendVisibility(newVisibility); // Update state
    return false; // Prevent Plotly's default legend toggle behavior
  };

  function onChangeLayout(layout) {
    if (
      layout["xaxis.range[0]"] === chartLayout?.["xaxis.range[0]"] ||
      layout["xaxis.range[1]"] === chartLayout?.["xaxis.range[1]"]
    )
      return;
    console.log(
      "layout",
      dayjs(layout["xaxis.range[0]"]).startOf("day").format("YYYY-MM-DD")
    );
    console.log(
      "chartLayout",
      dayjs(chartLayout?.["xaxis.range[0]"]).format("YYYY-MM-DD")
    );
    if (
      dayjs(layout["xaxis.range[1]"]).startOf("day") >=
      dayjs(
        testData[Object.keys(testData)[0]].date[
          testData[Object.keys(testData)[0]].date.length - 1
        ]
      )
    ) {
      toast.error("You've reached the end of the data range.", {
        icon: "⚠️",
        id: "toastId123",
      });
      if (
        dayjs(layout["xaxis.range[0]"]) > dayjs(chartLayout?.["xaxis.range[0]"])
      )
        toast.remove("toastId123");
    }

    setChartLayout({
      x0: dayjs(layout["xaxis.range[0]"]).startOf("day"),
      x1: dayjs(layout["xaxis.range[1]"]).startOf("day"),
    });

    const filteredData = filterModelsByDateRange(
      baseData,
      dayjs(layout["xaxis.range[0]"]).startOf("day"),
      dayjs(layout["xaxis.range[1]"]).startOf("day")
    );
    setChartData(filteredData);
  }

  function handleReset() {
    setChartData(testData);
    setToggle(false);
    setChartLayout(null);
  }

  function handleRelayout() {
    if (!chartLayout?.x0) return;
    const filteredData = filterModelsByDateRange(
      baseData,
      chartLayout?.["x0"],
      chartLayout?.["x1"]
    );
    setChartData(filteredData);
  }

  return {
    layoutRef,
    onChangeLayout,
    handleReset,
    handleRelayout,
    chartLayout,
    setChartLayout,
    legendVisibility,
    handleLegendClick,
  };
}
