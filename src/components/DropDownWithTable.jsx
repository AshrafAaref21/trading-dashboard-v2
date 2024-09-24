import { Button, Select, Table, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const DropdownWithTable = ({
  selectedOption,
  handleSelectChange,
  dataframes,
}) => {
  const dataSource = dataframes[selectedOption].date
    .map((_, index) =>
      Object.keys(dataframes[selectedOption]).reduce((acc, key) => {
        acc[key] = dataframes[selectedOption][key][index]; // Assign corresponding values for each column
        acc.key = index; // Ensure each row has a unique key
        return acc;
      }, {})
    )
    .filter((row) => row.profit_total !== null);

  const columns = Object.keys(dataframes["Current"]).map((key) => ({
    title:
      key.replace(/_/g, " ").charAt(0).toUpperCase() +
      key.replace(/_/g, " ").slice(1),
    dataIndex: key, // The key becomes the dataIndex
    key, // Unique key for each column
    width: 100, // You can adjust the width or remove it
    render: (text) => (
      <div style={{ fontSize: "12px" }}>
        {typeof text === "number" ? text.toFixed(2) : text}
      </div>
    ),
  }));

  const downloadCSV = () => {
    const headers = columns.map((col) => col.title).join(",") + "\n"; // Create CSV headers
    const rows = dataSource
      .map((row) => columns.map((col) => row[col.dataIndex]).join(","))
      .join("\n"); // Convert each row into a CSV row

    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Seer ${selectedOption} Data.csv`);
    document.body.appendChild(link); // Append the link to the DOM
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Remove the link from the DOM
  };

  return (
    <div style={{ marginBottom: "35px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Select
          value={selectedOption}
          style={{ width: "80%", height: 35 }}
          onChange={handleSelectChange}
        >
          <Option value="Current">Displayed Data</Option>
          <Option value="Excluded">Exclusions Data</Option>
          <Option value="Full">Original Data</Option>
        </Select>
        <Tooltip title="Download as csv">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadCSV}
            shape="round"
            size="large"
          />
        </Tooltip>
      </div>

      <Table
        style={{ width: "500px", fontSize: "12px" }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 500, y: 200 }}
        bordered
      />
    </div>
  );
};

export default DropdownWithTable;
