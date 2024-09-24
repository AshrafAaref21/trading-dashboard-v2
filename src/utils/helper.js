import dayjs from "dayjs";

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
