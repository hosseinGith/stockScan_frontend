import { BrowserRouter } from "react-router";

import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { lazy, useLayoutEffect } from "react";
import { store } from "./stores";

const Loading = lazy(() => import("./components/common/Loading"));
const NotFound = lazy(() => import("./components/layout/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  useLayoutEffect(() => {
    if (Number(localStorage.getItem("theme")))
      document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Toaster position="top-center" richColors closeButton />
          {/* <CompleteFramerMotionDemo/> */}
          <BrowserRouter>
            <Loading />
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
