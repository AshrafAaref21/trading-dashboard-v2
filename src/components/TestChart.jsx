import { useRef, useState } from "react";
import Plot from "react-plotly.js";

function TestChart() {
  const [relayoutData, setRelayoutData] = useState(null);

  const layoutRef = useRef({
    // Store initial layout in a ref to avoid re-render
    title: "Zoom or Pan to Trigger Relayout",
    autosize: true,
    height: 400,
    width: 800,
  });

  const handleRelayout = (eventData) => {
    // Update the state to capture relayout data for tracking
    setRelayoutData(eventData);

    // Important: Do not update the layout state directly to prevent re-renders
    // Plotly will handle the zoom/pan automatically without resetting the layout
  };

  return (
    <div>
      <Plot
        data={[
          {
            x: [1, 2, 3, 4, 5],
            y: [2, 4, 6, 8, 10],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={layoutRef.current} // Use the layout from ref to avoid re-render
        config={{
          responsive: true, // Makes the chart responsive to container size
        }}
        onRelayout={handleRelayout} // Attach the handler here
        useResizeHandler={true} // Ensure the plot resizes dynamically
        style={{ width: "100%", height: "100%" }} // Fill available space
      />
      <div>
        <h3>Captured Relayout Data:</h3>
        {relayoutData && <pre>{JSON.stringify(relayoutData, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default TestChart;
