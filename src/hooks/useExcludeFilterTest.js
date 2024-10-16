import dayjs from "dayjs";
import { useDataContext } from "../context/DataContext";
import { useState } from "react";
import isBetween from "dayjs/plugin/isBetween"; // Import isBetween plugin
import { filterModelsMultipleRanges } from "../utils/helper";

dayjs.extend(isBetween);

export function useExcludeFilterTest() {
  const {
    initialTestData,
    testData,
    setTestData,
    chartTestData,
    setChartTestData,
    excludedRanges,
    setExcludedRanges,
  } = useDataContext();

  const startDate = dayjs(
    chartTestData[Object.keys(chartTestData)[0]].date[0]
  ).unix();
  const endDate = dayjs(
    chartTestData[Object.keys(chartTestData)[0]].date[
      chartTestData[Object.keys(chartTestData)[0]].date.length - 1
    ]
  ).unix();

  const [range, setRange] = useState([startDate, endDate]);

  const handleSliderChange = (values) => {
    setRange(values);
  };

  function handleClickFilter() {
    const newChartData = {};
    Object.keys(chartTestData).forEach((modelKey) => {
      const modelData = chartTestData[modelKey];
      // Check if modelData and modelData.date are defined
      if (!modelData || !Array.isArray(modelData.date)) {
        console.warn(
          `Model data for ${modelKey} is not defined or doesn't contain a date array.`
        );
        return; // Skip to the next model
      }

      const filteredModelData = {};
      Object.keys(modelData).forEach((key) => {
        filteredModelData[key] = [];
      });

      modelData.date.forEach((date, index) => {
        const itemDate = dayjs(date);
        const isExcluded = itemDate.isBetween(
          dayjs.unix(range[0]).startOf("day"),
          dayjs.unix(range[1]).endOf("day"),
          null,
          "[]"
        );

        Object.keys(filteredModelData).forEach((key) => {
          if (key === "date") {
            filteredModelData[key].push(modelData[key][index]); // Always push the date
          } else {
            filteredModelData[key].push(
              isExcluded ? null : modelData[key][index] // Push filtered values
            );
          }
        });
      });

      // Store the filtered data for the current model
      newChartData[modelKey] = filteredModelData;
    });
    setChartTestData(newChartData);
    const newData = {};

    // Initialize newData structure for each model
    Object.keys(testData).forEach((model) => {
      newData[model] = {}; // Initialize each model's data
      Object.keys(testData[model]).forEach((key) => {
        newData[model][key] = []; // Create empty arrays for each key
      });
    });

    // Filtering logic based on date range
    Object.keys(testData).forEach((model) => {
      const modelData = testData[model];

      // Ensure that we are using the date array from the correct model
      modelData.date.forEach((date, index) => {
        const itemDate = dayjs(date);
        const isExcluded = itemDate.isBetween(
          dayjs.unix(range[0]).startOf("day"),
          dayjs.unix(range[1]).endOf("day"),
          null,
          "[]"
        );

        Object.keys(newData[model]).forEach((key) => {
          if (key === "date") {
            newData[model][key].push(modelData[key][index]); // Always push the date
          } else {
            newData[model][key].push(isExcluded ? null : modelData[key][index]); // Push filtered values
          }
        });
      });
    });

    // Update the state with the new filtered data
    setTestData(newData);

    // Update the excluded ranges
    setExcludedRanges((state) => [
      ...state,
      range.map((val) => dayjs.unix(val).format("YYYY-MM-DD")),
    ]);
  }

  const isExcluded = (itemDate) => {
    return excludedRanges.some(([start, end]) => {
      const startDate = dayjs(start).unix();
      const endDate = dayjs(end).unix();
      return itemDate >= startDate && itemDate <= endDate;
    });
  };
  function handleResetExcluding() {
    const resetData = (originalData, initialData) => {
      const newData = {};

      // Initialize newData for each model in originalData
      Object.keys(originalData).forEach((modelKey) => {
        newData[modelKey] = {};

        // Initialize keys for each model
        Object.keys(originalData[modelKey]).forEach((key) => {
          newData[modelKey][key] = [];
        });
      });

      // Loop through each model and process its data
      Object.keys(originalData).forEach((modelKey) => {
        const modelData = originalData[modelKey];

        // Loop through each date in the model's data
        modelData.date.forEach((date, index) => {
          const itemDate = dayjs(date).unix();

          Object.keys(newData[modelKey]).forEach((key) => {
            if (key === "date") {
              // Always include the date
              newData[modelKey][key].push(modelData[key][index]);
            } else {
              // If the date is in any excluded range, restore value from initialData
              const value = isExcluded(itemDate)
                ? initialData[modelKey][key][index] // Access the initial data for the specific model
                : modelData[key][index];
              newData[modelKey][key].push(value);
            }
          });
        });
      });

      return newData;
    };

    // Reset chartData and testData to their initial values
    const newChartData = resetData(chartTestData, initialTestData);
    const newData = resetData(testData, initialTestData);

    // Set the new data
    setChartTestData(newChartData);
    setTestData(newData); // Updated to setTestData
  }

  function HandleIsFilter() {
    const newChartData = filterModelsMultipleRanges(
      excludedRanges,
      chartTestData
    );
    setChartTestData(newChartData);
    const newData = filterModelsMultipleRanges(excludedRanges, testData);
    setTestData(newData);
  }

  return {
    range,
    HandleIsFilter,
    handleSliderChange,
    handleClickFilter,
    handleResetExcluding,
  };
}
