import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import "./dashboard.css";
import TabbedCharts from "./TabbedCharts";
import { useDataContext } from "../context/DataContext";

import StatisticsCard from "./StatisticsCard";
import DropdownWithTable from "./DropDownWithTable";
import { useDataTables } from "../hooks/useDataTables";

function Dashboard() {
  const { setInitialData, setData, setChartData, setExcludedRanges } =
    useDataContext();
  const { selectedOption, handleSelectChange, dataframes } = useDataTables();
  return (
    <div className="dash-layout">
      <div className="dash-container">
        <TabbedCharts />
        <div style={{ marginTop: "1rem", height: "100%" }}>
          <DropdownWithTable
            selectedOption={selectedOption}
            handleSelectChange={handleSelectChange}
            dataframes={dataframes}
          />
          <StatisticsCard displayData={dataframes[selectedOption]} />
          {/* <ScrollableTable /> */}
        </div>
      </div>
      <Tooltip title="Back to form" placement="top">
        <Button
          className="dash-btn"
          onClick={() => {
            setInitialData({});
            setData({});
            setChartData({});
            setExcludedRanges([]);
          }}
          shape="circle"
          type="dashed"
          icon={<LeftCircleOutlined />}
        />
      </Tooltip>
    </div>
  );
}

export default Dashboard;
