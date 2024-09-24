import { Tabs } from "antd";
import Item from "antd/es/list/Item";
import ProfitCumChart from "./ProfitCumChart";
import WinsLossesChart from "./WinsLossesChart";
import ExcludeRange from "./ExcludeRange";

// const { TabPane } = Tabs;

const TabbedCharts = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        // onChange={() => {
        //   handleReset();
        //   setIsFilterEnabled(false);
        // }}
        centered
      >
        <Item tab="Profit Chart" key="1">
          <ProfitCumChart />
        </Item>

        <Item tab="Wins vs Losses" key="2">
          <WinsLossesChart />

          {/* <CustomPlot
            Ys={[
              { name: "mwh_total", title: "# Economics" },
              { name: "win_count", title: "# Wins" },
            ]}
            mode="lines"
          /> */}
        </Item>
      </Tabs>
      <ExcludeRange />
    </div>
  );
};

export default TabbedCharts;
