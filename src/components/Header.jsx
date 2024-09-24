import { BarChartOutlined } from "@ant-design/icons";

function Header() {
  return (
    <div style={{ display: "flex" }}>
      <h1 style={{ width: "100%" }}>Trading Dashboard</h1>
      <BarChartOutlined style={{ marginLeft: "auto", fontSize: "32px" }} />
    </div>
  );
}

export default Header;
