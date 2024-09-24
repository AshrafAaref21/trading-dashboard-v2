import { Button, Table } from "antd";
import { useDataContext } from "../context/DataContext";
import { DownloadOutlined } from "@ant-design/icons";

const ScrollableTable = () => {
  const { chartData, data, toggle } = useDataContext();

  const tableData = toggle ? chartData : data;

  const columns = Object.keys(tableData).map((key) => ({
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

  const dataSource = tableData.date
    .map((_, index) =>
      Object.keys(tableData).reduce((acc, key) => {
        acc[key] = tableData[key][index]; // Assign corresponding values for each column
        acc.key = index; // Ensure each row has a unique key
        return acc;
      }, {})
    )
    .filter((row) => row.profit_total !== null);

  const downloadCSV = () => {
    const headers = columns.map((col) => col.title).join(",") + "\n"; // Create CSV headers
    const rows = dataSource
      .map((row) => columns.map((col) => row[col.dataIndex]).join(","))
      .join("\n"); // Convert each row into a CSV row

    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seer.csv");
    document.body.appendChild(link); // Append the link to the DOM
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Remove the link from the DOM
  };

  return (
    <div style={{ marginTop: "1.5rem", height: "100%" }}>
      <Table
        style={{ width: "500px", fontSize: "12px" }}
        columns={columns}
        dataSource={dataSource}
        pagination={false} // Disable pagination for simplicity
        scroll={{ x: 500, y: 222 }} // Make the table scrollable
        bordered
      />
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={downloadCSV}
        title="Download as csv"
        shape="round"
        size="large"
        style={{ marginTop: "1.2rem" }}
      >
        Download
      </Button>
    </div>
  );
};

export default ScrollableTable;
