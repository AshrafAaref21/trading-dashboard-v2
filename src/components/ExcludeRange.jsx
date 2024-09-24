import dayjs from "dayjs";
import { useDataContext } from "../context/DataContext";
import { Button, Checkbox, DatePicker, Slider } from "antd";
import { useExcludeFilter } from "../hooks/useExcludeFilter";

function ExcludeRange() {
  const {
    data,
    chartData,
    toggle,
    isFilterEnabled,
    setIsFilterEnabled,
    excludedRanges,
    setExcludedRanges,
  } = useDataContext();

  const targetData = toggle ? chartData : data;

  const startDate = dayjs(targetData.date[0]).unix();
  const endDate = dayjs(targetData.date[targetData.date.length - 1]).unix();

  const {
    range,
    HandleIsFilter,
    handleSliderChange,
    handleClickFilter,
    handleResetExcluding,
  } = useExcludeFilter();

  const handleCheckboxChange = (e) => {
    setIsFilterEnabled(e.target.checked);
    if (!e.target.checked && excludedRanges.length > 0) handleResetExcluding();
    if (e.target.checked && excludedRanges.length > 0) HandleIsFilter();
  };

  // const disabledDate = (current) => {
  //   return current && (current.isBefore(minDate) || current.isAfter(maxDate));
  // };

  return (
    <div style={{ marginTop: "15px", padding: "0 100px", width: "100%" }}>
      <>
        <Checkbox
          onChange={handleCheckboxChange}
          checked={isFilterEnabled}
          style={{ width: "33%" }}
        >
          Enable Date Range Filter
        </Checkbox>
        <Button
          disabled={!isFilterEnabled}
          // danger
          type="dashed"
          shape="round"
          onClick={handleClickFilter}
          style={{ marginLeft: "3rem" }}
        >
          Exclude Range
        </Button>

        <Button
          danger
          // type="dashed"
          disabled={excludedRanges.length < 1 || !isFilterEnabled}
          shape="round"
          onClick={() => {
            handleResetExcluding();
            setIsFilterEnabled(false);
            setExcludedRanges([]);
          }}
          style={{ marginLeft: "3rem" }}
        >
          Reset Excluded Ranges
        </Button>
      </>

      {isFilterEnabled && (
        // <DatePicker.RangePicker
        //   // style={{ width: "60%" }}
        //   // minDate={"2024-01-01"}
        //   // maxDate={"2024-03-31"}

        //   format="YYYY-MM-DD"
        //   onChange={(value) => console.log(value)}
        //   disabledDate={disabledDate}
        //   // disabled={isLoading}
        // />
        <Slider
          range
          value={range}
          min={startDate}
          max={endDate}
          onChange={handleSliderChange}
          tipFormatter={(value) => dayjs.unix(value).format("YYYY-MM-DD")}
          style={{ marginLeft: "50px" }}
        />
      )}
    </div>
  );
}

export default ExcludeRange;
