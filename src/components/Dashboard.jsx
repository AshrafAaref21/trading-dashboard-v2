import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import "./dashboard.css";
import TabbedCharts from "./TabbedCharts";
import { useDataContext } from "../context/DataContext";

import StatisticsCard from "./StatisticsCard";
import DropdownWithTable from "./DropDownWithTable";
import { useDataTables } from "../hooks/useDataTables";
import TestModels from "./TestModels";

function Dashboard() {
  const {
    setInitialTestData,
    setTestData,
    setChartTestData,
    setExcludedRanges,
  } = useDataContext();
  const { selectedOption, handleSelectChange, dataframes } = useDataTables();
  return (
    <div className="dash-layout">
      <div className="dash-container">
        {/* <TabbedCharts /> */}
        <TestModels />
        <div style={{ height: "100%" }}>
          <DropdownWithTable
            selectedOption={selectedOption}
            handleSelectChange={handleSelectChange}
            dataframes={dataframes}
          />
          <StatisticsCard displayData={dataframes[selectedOption]} />
        </div>
      </div>
      <Tooltip title="Back to form" placement="top">
        <Button
          className="dash-btn"
          onClick={() => {
            setInitialTestData({});
            setTestData({});
            setChartTestData({});
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
