import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#020617",
            color: "#e2e8f0",
            border: "1px solid #1f2937",
          },
        }}
      />
    </>
  );
}

export default App;

