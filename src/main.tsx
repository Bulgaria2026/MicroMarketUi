import { App } from "@/App";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import { installAuthInterceptors } from "@/features/auth/lib/install-interceptors";
import { CartProvider } from "@/features/cart/context/cart-context";
import "@/index.css";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

installAuthInterceptors(api);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
