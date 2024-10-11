import { DollarOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Statistic, Table, Tooltip } from "antd";
import { useDataContext } from "../context/DataContext";

function StatisticsCard({ displayData }) {
  const { traceVisibility } = useDataContext();
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

  const dataSource = Object.keys(displayData).map((model) => ({
    modelName: model,
    totalProfit: displayData[model][`profit_${legend}`]
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2),
    profitPerMWh:
      Math.round(
        (100 *
          displayData[model][`profit_${legend}`].reduce(
            (acc, cur) => acc + cur,
            0
          )) /
          displayData[model][`mwh_${legend}`].reduce((acc, cur) => acc + cur, 0)
      ) / 100,

    winPercentage: Math.round(
      (100 *
        displayData[model][
          `${legend === "total" ? "win_count" : "win_count_" + legend}`
        ].reduce((acc, cur) => acc + cur, 0)) /
        (displayData[model][
          `${legend === "total" ? "win_count" : "win_count_" + legend}`
        ].reduce((acc, cur) => acc + cur, 0) +
          displayData[model][
            `${legend === "total" ? "loss_count" : "loss_count_" + legend}`
          ].reduce((acc, cur) => acc + cur, 0))
    ),
  }));

  const columns = [
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
    },
    {
      title: "Total Profit",
      dataIndex: "totalProfit",
      key: "totalProfit",
      render: (text) => (
        <span>
          <DollarOutlined style={{ color: "black", marginRight: 4 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Profit per MWh",
      dataIndex: "profitPerMWh",
      key: "profitPerMWh",
      render: (text) => (
        <Tooltip title="Profit per MWh">
          <span>
            <ThunderboltOutlined style={{ color: "black", marginRight: 4 }} />
            {text ? text : 0} $/MWh
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Win Percentage",
      dataIndex: "winPercentage",
      key: "winPercentage",
      render: (text) => (
        <Tooltip title="Win Percentage">
          {text ? text : 0}
          <span style={{ color: "black", marginLeft: 4 }}>%</span>
        </Tooltip>
      ),
    },
  ];

  const rowClassName = (record) => {
    return "m" + displayData[record.modelName].color[0]?.substring(1) || "red";
  };

  return (
    <div style={{ width: "100%" }}>
      <Table
        style={{ width: "500px" }}
        dataSource={dataSource}
        columns={columns}
        rowKey="modelName"
        pagination={false}
        bordered
        scroll={{ x: 500, y: 200 }}
        rowClassName={rowClassName}
      />
    </div>
  );
}

export default StatisticsCard;
