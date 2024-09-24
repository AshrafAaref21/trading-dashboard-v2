import DataServiceProvider from "./context/DataContext";
import Wrapper from "./components/Wrapper";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <DataServiceProvider>
      <Wrapper />
      <Toaster
        toastOptions={{
          duration: 6000,
          style: {
            background: "#fff4e5", // Light peach background
            color: "#856404", // Soft brown text color
            border: "1px solid #ffeeba", // Matching border
            padding: "10px", // Add some padding for better spacing
            marginTop: "18vh", // Adds top margin
            fontWeight: "bold", // Emphasize the text
            fontSize: "14px",
          },
        }}
      />
    </DataServiceProvider>
  );
}

export default App;
