import { createContext, useContext, useState } from "react";
import postData from "../utils/service";

const DataContext = createContext(null);

export function DataServiceProvider({ children }) {
  const requestData = postData;
  const [initialData, setInitialData] = useState({});
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [excludedRanges, setExcludedRanges] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [traceVisibility, setTraceVisibility] = useState([false, false, true]);

  console.log("excludedRanges", excludedRanges);

  return (
    <DataContext.Provider
      value={{
        error,
        setError,
        initialData,
        setInitialData,
        requestData,
        data,
        setData,
        chartData,
        setChartData,
        isLoading,
        setIsloading,
        isFilterEnabled,
        setIsFilterEnabled,
        excludedRanges,
        setExcludedRanges,
        toggle,
        setToggle,
        traceVisibility,
        setTraceVisibility,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);

  if (context === null) {
    throw new Error("Error - You have to use the DataServiceProvider");
  }
  return context;
}

export default DataServiceProvider;
