import toast from "react-hot-toast";
import { useDataContext } from "../context/DataContext";
import { MODEL_COLORS, NUMBER_OF_ALLOWED_COLORS } from "../utils/constants";

export function useSortData() {
  const {
    testData,
    chartTestData,
    setTestData,
    setChartTestData,
    traceVisibility,
  } = useDataContext();

  const modelNames = Object.keys(testData);

  const transformer = {
    short: 0,
    long: 1,
    total: 2,
  };

  const legend =
    Object.keys(transformer)[
      traceVisibility
        .map((value, index) => (value ? index : null))
        .filter((index) => index !== null)[0]
    ];

  function profitSorter(data) {
    // Initialize an empty object for each model using provided model name

    const modelProfits = modelNames.map((modelName) => {
      const totalProfit = data[modelName][`profit_${legend}`].reduce(
        (sum, value) => sum + value,
        0
      );
      return { modelName, totalProfit };
    });

    return modelProfits;
  }

  function mwhSorter(data) {
    const modelProfits = modelNames.map((modelName) => {
      const profitMwh =
        data[modelName][`profit_${legend}`].reduce((acc, cur) => acc + cur, 0) /
        data[modelName][`mwh_${legend}`].reduce((acc, cur) => acc + cur, 0);
      return { modelName, profitMwh };
    });

    return modelProfits;
  }

  function winSorter(data) {
    const modelProfits = modelNames.map((modelName) => {
      const profitMwh =
        data[modelName][
          `${legend === "total" ? "win_count" : "win_count_" + legend}`
        ].reduce((acc, cur) => acc + cur, 0) /
        (data[modelName][
          `${legend === "total" ? "win_count" : "win_count_" + legend}`
        ].reduce((acc, cur) => acc + cur, 0) +
          data[modelName][
            `${legend === "total" ? "loss_count" : "loss_count_" + legend}`
          ].reduce((acc, cur) => acc + cur, 0));

      return { modelName, profitMwh };
    });

    return modelProfits;
  }

  function dataSorter(data, sortFunction) {
    // Initialize an empty object for each model using provided model name

    const modelProfits = sortFunction(data);

    // Sort models by total profit in descending order
    modelProfits.sort((a, b) => b.totalProfit - a.totalProfit);

    console.log("modelProfits", modelProfits);

    let newModelsObj = {};
    // Assign colors: First 5 models get colors from the array, rest get grey
    modelProfits.forEach((model, index) => {
      const color =
        index < NUMBER_OF_ALLOWED_COLORS
          ? MODEL_COLORS[index]
          : MODEL_COLORS[MODEL_COLORS.length - 1]; // First 5 get colors, rest get grey
      data[model.modelName].color = new Array(
        data[Object.keys(data)[0]].date.length
      ).fill(color); // Properly assign the color as a string

      newModelsObj[model.modelName] = data[model.modelName];
    });

    return newModelsObj;
  }

  function sortByProfit() {
    const newTestData = dataSorter(testData, profitSorter);
    setTestData(newTestData);
    const newChartTestData = dataSorter(chartTestData, profitSorter);
    setChartTestData(newChartTestData);
  }
  function sortByMwh() {
    const newTestData = dataSorter(testData, mwhSorter);
    setTestData(newTestData);
    const newChartTestData = dataSorter(chartTestData, mwhSorter);
    setChartTestData(newChartTestData);
  }
  function sortByWin() {
    const newTestData = dataSorter(testData, winSorter);
    setTestData(newTestData);
    const newChartTestData = dataSorter(chartTestData, winSorter);
    setChartTestData(newChartTestData);
  }

  function sortDataBy(sortBy) {
    if (!sortBy) return;

    if (sortBy === "Total Profit") {
      sortByProfit();
      toast.success(`Data has been sorted by ${legend} profit`, {
        duration: 2000,
        iconTheme: {
          primary: "#fff",
          secondary: "#007bff",
        },
        style: {
          backgroundColor: "#28a745",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          paddingLeft: "30px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        },
      });
    }
    if (sortBy === "Profit per MWh") {
      sortByMwh();
      toast.success(`Data has been sorted by ${legend} profit per Mwh`, {
        duration: 2000,
        iconTheme: {
          primary: "#fff",
          secondary: "#007bff",
        },
        style: {
          backgroundColor: "#28a745",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          // padding: "16px 24px",
          paddingLeft: "30px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        },
      });
    }
    if (sortBy === "Win Percentage") {
      sortByWin();
      toast.success(`Data has been sorted by ${legend} wins percentage`, {
        duration: 2000,
        iconTheme: {
          primary: "#fff",
          secondary: "#007bff",
        },
        style: {
          backgroundColor: "#28a745",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          // padding: "16px 24px",
          paddingLeft: "30px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        },
      });
    }
  }

  return { sortDataBy };
}
