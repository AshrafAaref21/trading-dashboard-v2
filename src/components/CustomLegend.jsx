import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useDataContext } from "../context/DataContext";

function CustomLegend() {
  const { traceVisibility, setTraceVisibility } = useDataContext();

  const transformer = {
    short: 0,
    long: 1,
    total: 2,
  };

  const handleSelectChange = (value) => {
    const newVisibility = traceVisibility.map(
      (_, index) => index === transformer[value]
    );

    setTraceVisibility(newVisibility);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "30%",
      }}
    >
      <Select
        value={
          Object.keys(transformer)[
            traceVisibility
              .map((value, index) => (value ? index : null))
              .filter((index) => index !== null)[0]
          ]
        }
        onChange={handleSelectChange}
      >
        <Option value="short">Short</Option>
        <Option value="long">Long</Option>
        <Option value="total">Total</Option>
      </Select>
    </div>
  );
}

export default CustomLegend;
