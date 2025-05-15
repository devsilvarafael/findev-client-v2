import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router.tsx";
import { ReactQueryProvider } from "@/config/ReactQueryProvider";
import { Toaster } from "sonner";
import { UserContextProvider } from "@/contexts/UserContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <Toaster richColors position="bottom-right" />
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </ReactQueryProvider>
  </StrictMode>
);
