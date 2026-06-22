import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
import { ThemeProvider } from "./context/theme.context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </ThemeProvider>
    </QueryClientProvider>
    {/* Toaster library for displaying success and error messages */}
    <Toaster
      toastOptions={{
        duration: 6000,
        style: {
          background: "#e0edff",
          color: "#1d4ed8",
          border: "1px solid #1d4ed8",
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(29, 78, 216, 0.08)",
        },
        iconTheme: {
          primary: "#1d4ed8",
          secondary: "#e0edff",
        },
      }}
    />
  </React.StrictMode>
);
