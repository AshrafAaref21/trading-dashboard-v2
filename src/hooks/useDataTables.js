import { useState } from "react";
import { useDataContext } from "../context/DataContext";
import { filterMultipleRanges } from "../utils/helper";

export function useDataTables() {
  const [selectedOption, setSelectedOption] = useState("Current");
  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const {
    initialData,
    data,
    chartData,
    toggle,
    isFilterEnabled,
    excludedRanges,
  } = useDataContext();

  const tableData = toggle ? chartData : data;

  const dataframes = {
    Current: tableData,
    Excluded: isFilterEnabled
      ? data
      : filterMultipleRanges(excludedRanges, data),
    Full: initialData,
  };

  return {
    selectedOption,
    handleSelectChange,
    dataframes,
  };
}
