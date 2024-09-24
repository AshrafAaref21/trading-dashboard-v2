import Plot from "react-plotly.js";
import { useDataContext } from "../context/DataContext";
import { mergeRanges } from "../utils/helper";
import dayjs from "dayjs";
import CustomLegend from "./CustomLegend";

function WinsLossesChart() {
  const { data, excludedRanges, isFilterEnabled, traceVisibility } =
    useDataContext();
  const transformer = {
    0: "short",
    1: "long",
    2: "total",
  };

  const legend = traceVisibility
    .map((value, index) => (value ? index : null))
    .filter((index) => index !== null)[0];

  const transformedData = [
    {
      x: data.date,
      y: data[
        `${
          transformer[legend] === "total"
            ? "win_count"
            : "win_count_" + transformer[legend]
        }`
      ].map((value) => (value === null ? 0 : value)),
      name:
        transformer[legend] === "total"
          ? "# Total Wins"
          : `# ${
              transformer[legend][0].toUpperCase() +
              transformer[legend].substring(1)
            } Wins`,
      mode: "lines+markers",
    },
    {
      x: data.date,
      y: data[`mwh_${transformer[legend]}`].map((value) =>
        value === null ? 0 : value
      ),
      name: `# ${
        transformer[legend][0].toUpperCase() + transformer[legend].substring(1)
      } Economics`,
      mode: "lines+markers",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <CustomLegend />
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

export default WinsLossesChart;
