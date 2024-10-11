import { useState } from "react";
import { useDataContext } from "../context/DataContext";
import { filterModelsMultipleRanges } from "../utils/helper";

export function useDataTables() {
  const [selectedOption, setSelectedOption] = useState("Current");
  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const {
    initialTestData,
    testData,
    chartTestData,
    toggle,
    isFilterEnabled,
    excludedRanges,
  } = useDataContext();

  const tableData = toggle ? chartTestData : testData;

  const dataframes = {
    Current: tableData,
    Excluded: isFilterEnabled
      ? testData
      : filterModelsMultipleRanges(excludedRanges, testData),
    Full: initialTestData,
  };

  return {
    selectedOption,
    handleSelectChange,
    dataframes,
  };
}
