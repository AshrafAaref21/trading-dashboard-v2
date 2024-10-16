import { Button, Select, Table, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "./DropdownWithTable.css";

const { Option } = Select;

const DropdownWithTable = ({
  selectedOption,
  handleSelectChange,
  dataframes,
}) => {
  const dataSource = [];

  // Loop through each model and construct the data source
  Object.keys(dataframes[selectedOption]).forEach((modelName) => {
    const modelData = dataframes[selectedOption][modelName];

    if (modelData && modelData.date) {
      modelData.date.forEach((_, index) => {
        const row = {
          key: `${modelName}-${index}`, // Unique key for each row (modelName + index)
          model_name: modelName, // Add model name for identification
        };

        // Add each column value for the current row (index)
        Object.keys(modelData).forEach((columnKey) => {
          row[columnKey] = modelData[columnKey][index];
        });

        dataSource.push(row); // Add the row to the data source
      });
    } else {
      console.warn(`No data found for model: ${modelName}`); // Log a warning if model data is missing
    }
  });

  // If dataSource is empty, log a message
  if (dataSource.length === 0) {
    console.error(
      "Data source is empty. Please check the structure of the dataframes."
    );
  }

  // Create columns dynamically from the keys of the first model
  const columns = [
    // {
    //   title: "Model Name",
    //   dataIndex: "model_name",
    //   key: "model_name",
    //   width: 100,
    // },
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   key: "date",
    //   width: 100,
    // },
    ...Object.keys(
      dataframes[selectedOption][Object.keys(dataframes[selectedOption])[0]] ||
        {}
    )
      .map((key) => {
        // Exclude 'color' from columns
        if (key !== "color") {
          return {
            title:
              key.replace(/_/g, " ").charAt(0).toUpperCase() +
              key.replace(/_/g, " ").slice(1), // Capitalize and replace underscores with spaces
            dataIndex: key, // The key becomes the dataIndex
            key, // Unique key for each column
            width: 100, // You can adjust the width or remove it
            render: (text) => (
              <div style={{ fontSize: "12px" }}>
                {typeof text === "number" ? text.toFixed(2) : text}{" "}
                {/* Format numbers */}
              </div>
            ),
          };
        }
        return null; // Return null if it's the 'color' column
      })
      .filter((col) => col !== null), // Remove null columns
  ];

  const rowClassName = (record) =>
    "m" +
      dataframes[selectedOption][record.model_name].color[0]?.substring(1) ||
    "red"; // Default to white if model not found

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
        scroll={{ x: 500, y: 100 }}
        bordered
        rowClassName={rowClassName}
      />
    </div>
  );
};

export default DropdownWithTable;
