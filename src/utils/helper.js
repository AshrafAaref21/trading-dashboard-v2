import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { MODEL_COLORS } from "./constants";
// Extend dayjs with the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function toDate(days) {
  // Create a date starting from 1970-01-01 and add the given number of days
  return dayjs("1970-01-01").add(days, "day").format("YYYY-MM-DD");
}

export function cumulativeSum(arr) {
  let cumSum = 0;
  return arr.map((value) => {
    // Check if the value is null or undefined, treat it as 0
    cumSum += value !== null && value !== undefined ? value : 0;
    return cumSum;
  });
}

export function filterObjectByDateRange(data, startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const newObj = {};

  if (data) {
    Object.keys(data).map((key) => {
      newObj[key] = [];
    });
  }

  data.date.map((date, index) => {
    const itemDate = dayjs(date);
    if (itemDate >= start && itemDate <= end) {
      newObj.date = [...newObj.date, itemDate.format("YYYY-MM-DD")];
      Object.keys(newObj).map((key) => {
        if (key === "date") return;
        newObj[key] = [...newObj[key], data[key][index]];
      });
    }
  });

  // Return a new object with filtered data
  return newObj;
}

export function getUniqueSubArrays(arr) {
  const seen = new Set();
  return arr.filter((subArray) => {
    const serialized = JSON.stringify(subArray);
    const isDuplicate = seen.has(serialized);
    seen.add(serialized);
    return !isDuplicate;
  });
}

export function mergeRanges(ranges) {
  if (ranges.length === 0) return [];

  const uniqueRanges = getUniqueSubArrays(ranges);

  // Sort ranges by their start value
  const parsedRanges = uniqueRanges.map(([start, end]) => [
    new Date(start),
    new Date(end),
  ]);

  const sortedRanges = [...parsedRanges].sort((a, b) => a[0] - b[0]);

  return sortedRanges.reduce((merged, [currentStart, currentEnd]) => {
    if (merged.length === 0 || currentStart > merged[merged.length - 1][1]) {
      return [...merged, [currentStart, currentEnd]];
    } else {
      const lastRange = merged[merged.length - 1];
      const newEnd = new Date(
        Math.max(lastRange[1].getTime(), currentEnd.getTime())
      );
      return [...merged.slice(0, -1), [lastRange[0], newEnd]];
    }
  }, []);
}

export function filterMultipleRanges(excludedRanges, chartData) {
  const isDateExcluded = (date) => {
    const itemDate = dayjs(date);
    return excludedRanges.some(([start, end]) => {
      const startDate = dayjs(start);
      const endDate = dayjs(end);
      return itemDate.isBetween(startDate, endDate, null, "[]");
    });
  };

  const newChartData = {};

  Object.keys(chartData).map((key) => {
    newChartData[key] = [];
  });

  chartData.date.map((date, index) => {
    const itemDate = dayjs(date);
    const isExcluded = isDateExcluded(itemDate);

    Object.keys(newChartData).map((key) => {
      if (key === "date") {
        newChartData[key] = [...newChartData[key], chartData[key][index]];
      } else {
        newChartData[key] = [
          ...newChartData[key],
          isExcluded ? null : chartData[key][index],
        ];
      }
    });
  });

  return newChartData;
}

export function processDataWithMapAndFilter(response, modelNames) {
  const modelResults = {};

  // Initialize an empty object for each model using provided model names
  modelNames.forEach((modelName) => {
    modelResults[modelName] = {};
    Object.keys(response).forEach((key) => {
      modelResults[modelName][key] = []; // Initialize each column as an empty array
    });
  });

  // Track the current model index and the number of entries added
  let currentModelIndex = 0;
  let modelEntryCount = 0; // Counter for how many entries we've seen for the current model
  const totalEntriesPerModel = Math.floor(
    response.date.length / modelNames.length
  ); // Average number of entries per model

  // Go through each entry in the response
  response.date.forEach((date, index) => {
    // Check if we need to switch models based on the number of entries
    if (modelEntryCount >= totalEntriesPerModel) {
      currentModelIndex++; // Move to the next model
      modelEntryCount = 0; // Reset the counter for the new model
    }

    // Append data to the current model
    Object.keys(response).forEach((key) => {
      modelResults[modelNames[currentModelIndex]][key].push(
        response[key][index]
      );
    });

    modelEntryCount++; // Increment the entry count for the current model
  });

  // Calculate total profit for each model and store it in the modelResults
  const modelProfits = modelNames.map((modelName) => {
    const totalProfit = modelResults[modelName].profit_total.reduce(
      (sum, value) => sum + value,
      0
    );
    return { modelName, totalProfit };
  });

  // Sort models by total profit in descending order
  modelProfits.sort((a, b) => b.totalProfit - a.totalProfit);

  // Assign colors: First 5 models get colors from the array, rest get grey
  modelProfits.forEach((model, index) => {
    const color =
      index < 5 ? MODEL_COLORS[index] : MODEL_COLORS[MODEL_COLORS.length - 1]; // First 5 get colors, rest get grey
    modelResults[model.modelName].color = new Array(
      modelResults[Object.keys(modelResults)[0]].date.length
    ).fill(color); // Properly assign the color as a string
  });

  return modelResults;
}

export function transformToChartData(originalData, legend) {
  let data = [];

  Object.keys(originalData).forEach((key) => {
    data.push({
      x: originalData[key].date,
      y: cumulativeSum(originalData[key][`profit_${legend}`]),
      name: key,
      type: "scatter",
      mode: "lines+markers", // This makes the plot only display lines+markers
      marker: {
        size: 4, // Customize marker size
        // color: originalData[key].color,
      },
      line: {
        color: originalData[key].color[0],
      },
    });
  });

  return data;
}

export function filterModelsByDateRange(modelsData, startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const filteredModels = {};

  // Iterate over each model in modelsData
  Object.keys(modelsData).forEach((modelKey) => {
    const modelData = modelsData[modelKey];
    const newObj = {};

    // Initialize newObj with the same keys as modelData and empty arrays
    if (modelData) {
      Object.keys(modelData).forEach((key) => {
        newObj[key] = [];
      });
    }

    // Iterate over the model's date array
    modelData.date.forEach((date, index) => {
      const itemDate = dayjs(date);

      // Check if date is within range
      if (itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end)) {
        newObj.date.push(itemDate.format("YYYY-MM-DD"));

        // Iterate over each key in modelData and push corresponding values
        Object.keys(newObj).forEach((key) => {
          if (key !== "date") {
            newObj[key].push(modelData[key][index]);
          }
        });
      }
    });

    // Save the filtered data for the current model
    filteredModels[modelKey] = newObj;
  });

  return filteredModels;
}

export function filterModelsObjectByDateRange(data, startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const newData = {};

  // Loop through each model
  Object.keys(data).forEach((modelKey) => {
    const modelData = data[modelKey];
    const filteredModelData = {};

    // Initialize new arrays for each key in the model (dates, columns)
    Object.keys(modelData).forEach((key) => {
      filteredModelData[key] = [];
    });

    // Filter the dates and corresponding data for each model
    modelData.date.forEach((date, index) => {
      const itemDate = dayjs(date);

      // Check if the date is within the provided range
      if (itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end)) {
        filteredModelData.date.push(itemDate.format("YYYY-MM-DD"));
        Object.keys(modelData).forEach((key) => {
          if (key !== "date") {
            filteredModelData[key].push(modelData[key][index]);
          }
        });
      }
    });

    // Store the filtered data for the current model
    newData[modelKey] = filteredModelData;
  });

  return newData;
}

export function filterModelsMultipleRanges(excludedRanges, chartData) {
  const isDateExcluded = (date) => {
    const itemDate = dayjs(date);
    return excludedRanges.some(([start, end]) => {
      const startDate = dayjs(start);
      const endDate = dayjs(end);
      return itemDate.isBetween(startDate, endDate, null, "[]");
    });
  };

  const newChartData = {};

  // Loop through each model in the chartData
  Object.keys(chartData).forEach((modelKey) => {
    const modelData = chartData[modelKey];
    const filteredModelData = {};

    // Initialize new arrays for each key (dates, columns) in the model
    Object.keys(modelData).forEach((key) => {
      filteredModelData[key] = [];
    });

    // Loop through the dates and apply exclusion for each model
    modelData.date.forEach((date, index) => {
      const isExcluded = isDateExcluded(date);

      Object.keys(modelData).forEach((key) => {
        if (key === "date") {
          filteredModelData[key].push(modelData[key][index]);
        } else {
          filteredModelData[key].push(
            isExcluded ? null : modelData[key][index]
          );
        }
      });
    });

    // Save the filtered data for the current model
    newChartData[modelKey] = filteredModelData;
  });

  return newChartData;
}

export function transformToWinsLossesChartData(originalData, legend) {
  let data = [];

  Object.keys(originalData).forEach((key) => {
    data.push({
      x: originalData[key].date,
      y: originalData[key][
        `${legend === "total" ? "win_count" : "win_count_" + legend}`
      ].map((value) => (value === null ? 0 : value)),

      name:
        legend === "total"
          ? `# Total Wins (${key})`
          : `# ${legend[0].toUpperCase() + legend.substring(1)} Wins (${key})`,
      type: "scatter",
      mode: "lines+markers", // This makes the plot only display lines+markers
      marker: {
        size: 4, // Customize marker size
      },
      line: {
        color: originalData[key].color[0],
      },
    });

    data.push({
      x: originalData[key].date,
      y: originalData[key][`mwh_${legend}`].map((value) =>
        value === null ? 0 : value
      ),

      name: `# ${
        legend[0].toUpperCase() + legend.substring(1)
      } Economics (${key})`,

      type: "scatter",
      mode: "lines+markers", // This makes the plot only display lines+markers
      marker: {
        size: 4, // Customize marker size
      },
      line: {
        color: originalData[key].color[0],
        dash: "dot",
      },
    });
  });

  return data;
}
