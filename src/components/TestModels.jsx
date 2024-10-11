import { Button, Switch, Tabs, Tooltip } from "antd";
import { useDataContext } from "../context/DataContext";
import Plot from "react-plotly.js";
import Item from "antd/es/list/Item";
import { mergeRanges, transformToChartData } from "../utils/helper";
import CustomLegend from "./CustomLegend";
import { useTestRelayout } from "../hooks/useTestRelayout";
import ExcludeRangeTest from "./ExcludeRangeTest";
import dayjs from "dayjs";
import WinLossesTest from "./test/WinLossesTest";

function TestModels() {
  const {
    testData,
    chartTestData,
    setChartTestData,
    traceVisibility,
    toggle,
    setToggle,
    excludedRanges,
    isFilterEnabled,
  } = useDataContext();

  const toggleData = toggle ? chartTestData : testData;

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

  const chartData = transformToChartData(toggleData, legend);
  const {
    onChangeLayout,
    handleReset,
    chartLayout,
    handleLegendClick,
    legendVisibility,
  } = useTestRelayout({}, testData, setChartTestData);

  return (
    <div style={{ height: "100%" }}>
      <Tabs defaultActiveKey="1" centered>
        <Item tab="Profit Chart" key="1">
          <div style={{ position: "relative", height: "100%" }}>
            <CustomLegend />

            <div
              style={{
                position: "absolute",
                top: "7px",
                left: "55%",
              }}
            >
              <Tooltip title="Area Only" placement="top">
                <Switch
                  disabled={chartLayout === null}
                  className="large-switch"
                  style={{ zIndex: "9999", marginTop: "auto" }}
                  checked={toggle}
                  onChange={(state) => {
                    setToggle(state);
                  }}
                />
              </Tooltip>

              <Tooltip title="Reset Changes" placement="top">
                <Button
                  style={{
                    marginLeft: "4rem",
                    zIndex: "9999",
                    padding: "4px",
                  }}
                  danger
                  size="large"
                  shape="circle"
                  onClick={handleReset}
                  disabled={!chartLayout}
                >
                  Reset
                </Button>
              </Tooltip>
            </div>
            <Plot
              data={chartData.map((trace, index) => ({
                ...trace,
                visible: legendVisibility[index] ? true : "legendonly",
              }))}
              style={{ width: "100%", height: "100%" }}
              layout={{
                width: 900,
                height: "100%",
                xaxis: {
                  title: "Date",
                  range: chartLayout
                    ? [
                        chartTestData[Object.keys(chartTestData)[0]].date[0],
                        chartTestData[Object.keys(chartTestData)[0]].date[
                          chartTestData[Object.keys(chartTestData)[0]].date
                            .length - 1
                        ],
                      ]
                    : [
                        testData[Object.keys(chartTestData)[0]].date[0],
                        testData[Object.keys(chartTestData)[0]].date[
                          testData[Object.keys(chartTestData)[0]].date.length -
                            1
                        ],
                      ],
                },
                yaxis: {
                  title: { text: "Profit Cumulative", standoff: 30 },
                },
                legend: {
                  x: -0.2,
                  y: 1.5,
                },
                showlegend: true,
                dragmode: chartLayout ? "pan" : "zoom",
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
              config={
                {
                  modeBarButtons: [
                    ["zoom2d", "pan2d", "zoomIn2d", "zoomOut2d"],
                  ],
                  displaylogo: false, // Remove the Plotly logo
                  responsive: true,
                } // Keep the chart responsive
              }
              useResizeHandler={true}
              onRelayout={(layout) => {
                onChangeLayout(layout);
              }}
              onLegendClick={handleLegendClick}
            />
          </div>
        </Item>

        <Item tab="Wins vs Losses" key="2">
          <WinLossesTest />
        </Item>
      </Tabs>
      <ExcludeRangeTest />
    </div>
  );
}

export default TestModels;
