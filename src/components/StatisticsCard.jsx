import { DollarOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Statistic, Tooltip } from "antd";
import { useDataContext } from "../context/DataContext";

function StatisticsCard({ displayData }) {
  const { traceVisibility } = useDataContext();
  const transformer = {
    0: "short",
    1: "long",
    2: "total",
  };

  const legend = traceVisibility
    .map((value, index) => (value ? index : null))
    .filter((index) => index !== null)[0];

  return (
    <div style={{ width: "500px" }}>
      <Row gutter={16} justify="center" style={{ textAlign: "center" }}>
        {/* Total Profit */}
        <Col span={8}>
          <Tooltip
            title={`${
              transformer[legend][0].toUpperCase() +
              transformer[legend].substring(1)
            } Profit`}
          >
            <Card
              hoverable
              style={{
                width: "150px",
                height: "100px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: "8px", // Custom border radius if needed
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
              }}
            >
              <Statistic
                title={<span style={{ display: "none" }}>Total Profit</span>} // Hide title
                value={displayData[`profit_${transformer[legend]}`]
                  .reduce((acc, cur) => acc + cur, 0)
                  .toFixed(2)}
                prefix={
                  <DollarOutlined
                    style={{ color: "#3f8600", fontSize: "18px" }}
                  />
                } // Adjust icon size
                valueStyle={{
                  fontSize: "18px",
                  color: "#3f8600",
                  fontWeight: "bold",
                }} // Adjust font size
              />
            </Card>
          </Tooltip>
        </Col>

        {/* Profit per MWh */}
        <Col span={8}>
          <Tooltip title="Profit per MWh">
            <Card
              hoverable
              style={{
                width: "150px",
                height: "100px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: "8px", // Custom border radius if needed
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
              }}
            >
              <Statistic
                title={<span style={{ display: "none" }}>Profit per MWh</span>} // Hide title
                value={
                  Math.round(
                    (100 *
                      displayData[`profit_${transformer[legend]}`].reduce(
                        (acc, cur) => acc + cur,
                        0
                      )) /
                      displayData[`mwh_${transformer[legend]}`].reduce(
                        (acc, cur) => acc + cur,
                        0
                      )
                  ) / 100
                }
                prefix={
                  <ThunderboltOutlined
                    style={{ color: "#007bff", fontSize: "18px" }}
                  />
                } // Adjust icon size
                valueStyle={{
                  fontSize: "18px",
                  color: "#007bff",
                  fontWeight: "bold",
                }} // Adjust font size
                suffix="$/MWh"
              />
            </Card>
          </Tooltip>
        </Col>

        {/* Percentage of Trades Won */}
        <Col span={8}>
          <Tooltip title="Trades Won">
            <Card
              hoverable
              style={{
                width: "150px",
                height: "100px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: "8px", // Custom border radius if needed
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Progress
                  type="circle"
                  percent={Math.round(
                    (100 *
                      displayData[
                        `${
                          transformer[legend] === "total"
                            ? "win_count"
                            : "win_count_" + transformer[legend]
                        }`
                      ].reduce((acc, cur) => acc + cur, 0)) /
                      (displayData[
                        `${
                          transformer[legend] === "total"
                            ? "win_count"
                            : "win_count_" + transformer[legend]
                        }`
                      ].reduce((acc, cur) => acc + cur, 0) +
                        displayData[
                          `${
                            transformer[legend] === "total"
                              ? "loss_count"
                              : "loss_count_" + transformer[legend]
                          }`
                        ].reduce((acc, cur) => acc + cur, 0))
                  )}
                  strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                  format={(percent) => `${percent}%`}
                  width={60} // Adjust width of progress circle
                />
              </div>
            </Card>
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticsCard;
