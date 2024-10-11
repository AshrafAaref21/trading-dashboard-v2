import Plot from "react-plotly.js";

import CustomLegend from "../CustomLegend";
import { useDataContext } from "../../context/DataContext";
import {
  mergeRanges,
  transformToWinsLossesChartData,
} from "../../utils/helper";
import dayjs from "dayjs";

function WinLossesTest() {
  const { testData, excludedRanges, isFilterEnabled, traceVisibility } =
    useDataContext();
  const transformer = {
    short: 0,
    long: 1,
    total: 2,
  };

  const legend =
    Object.keys(transformer)[
      traceVisibility
        .map((value, index) => (value ? index : null))
        .filter((index) => index !== null)[0]
    ];

  const transformedData = transformToWinsLossesChartData(testData, legend);

  return (
    <div style={{ position: "relative" }}>
      <CustomLegend left={"50%"} />
      <Plot
        data={transformedData}
        layout={{
          xaxis: {
            title: "Date",
          },
          yaxis: {
            title: { text: "Wins and Losses", standoff: 30 }, // Y-axis label
          },
          showlegend: true, //
          legend: { x: -0.2, y: 1.5 },
          width: 900,
          height: "100%",
          shapes:
            excludedRanges.length > 0 && isFilterEnabled
              ? mergeRanges(excludedRanges).map(([start, end]) => ({
                  type: "rect",
                  x0: dayjs(start).add(1, "day").format("YYYY-MM-DD"),
                  x1: dayjs(end).add(1, "day").format("YYYY-MM-DD"),
                  y0: 0,
                  y1: 1,
                  xref: "x",
                  yref: "paper",
                  fillcolor: "rgba(200, 200, 200, 0.5)",
                  line: {
                    color: "rgba(200, 200, 200, 0.5)",
                    width: 0,
                  },
                }))
              : [],
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        // onRelayout={onChangeLayout}
        config={
          {
            modeBarButtons: [
              [
                "zoom2d", // Zoom button
                "pan2d", // Pan button
                "zoomIn2d", // Zoom in button
                "zoomOut2d",
                "resetScale2d",
              ],
            ],
            displaylogo: false, // Remove the Plotly logo
            responsive: true,
          } // Keep the chart responsive
        }
      />
    </div>
  );
}

export default WinLossesTest;
