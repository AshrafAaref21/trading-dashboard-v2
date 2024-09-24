import Plot from "react-plotly.js";
import { Button, Switch, Tooltip } from "antd";
import { useDataContext } from "../context/DataContext";
import { useRelayout } from "../hooks/useRelayout";

function CustomPlot({ x = "date", Ys, transX, transY, type, mode }) {
  const { data, chartData, setChartData, toggle, setToggle } = useDataContext();

  const { onChangeLayout, handleReset, chartLayout } = useRelayout(
    {},
    data,
    setChartData,
    setToggle
  );

  const toggleData = toggle ? chartData : data;

  const transformedData = Ys.map((arr) => {
    return {
      x: transX ? transX(toggleData[x]) : toggleData[x],
      y: transX ? transY(toggleData[arr.name]) : toggleData[arr.name],
      name: arr.title,
      type: type || "scatter",
      mode: mode || "lines+markers",
    };
  });

  return (
    <>
      <div style={{ marginTop: "10px", marginBottom: "-2.6rem" }}>
        <Tooltip title="Area Only" placement="top">
          <Switch
            className="large-switch"
            style={{ zIndex: "9999" }}
            checked={toggle}
            onChange={(state) => {
              setToggle(state);
            }}
          />
        </Tooltip>
        <Tooltip title="Reset Changes" placement="top">
          <Button
            style={{
              marginLeft: "3rem",
              marginRight: "-3rem",
              zIndex: "9999",
              padding: "8px",
            }}
            danger
            size="large"
            shape="circle"
            onClick={handleReset}
            disabled={data === chartData || !toggle}
          >
            Reset
          </Button>
        </Tooltip>
      </div>
      <Plot
        data={transformedData}
        layout={{
          width: 900,
          height: "100%",
          xaxis: {
            title: "Date",
            range: chartLayout
              ? [chartLayout?.["x0"], chartLayout?.["x1"]]
              : [data.date[0], data.date[data.date.length - 1]],
          },
          yaxis: {
            title: { text: "Profit Cumulative", standoff: 30 },
          },
          legend: {
            x: -0.2,
            y: 1.5,
          },
          showlegend: true,
          dragmode: "pan",
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        onRelayout={(layout) => {
          onChangeLayout(layout);
        }}
      />
    </>
  );
}

export default CustomPlot;
