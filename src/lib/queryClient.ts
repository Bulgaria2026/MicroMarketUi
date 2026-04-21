import { getApiErrorMessage } from "@/lib/api";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      suppressGlobalError?: boolean;
    };
  }
}

function handleGlobalError(error: unknown) {
  if (isAxiosError(error) && error.response?.status === 401) return;
  toast.error(getApiErrorMessage(error, "An unexpected error occurred."));
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => handleGlobalError(error),
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.suppressGlobalError) return;
      handleGlobalError(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
