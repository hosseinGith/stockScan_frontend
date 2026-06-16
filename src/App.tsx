import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { lazy, Suspense, useLayoutEffect } from "react";
import { store } from "./shared/stores";
import Dashboard from "./features/dashboard/Dashboard";
import ProductsList from "./features/products/ProductsList";
import ScanProduct from "./features/scanner/ScanProduct";
import ProductDetail from "./features/products/ProductDetail";
import Settings from "./features/settings/Settings";
import Auth from "./features/auth";
import ProductSearch from "./features/products/ProductSearch";

const Loading = lazy(() => import("./components/common/Loading"));

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
          <BrowserRouter>
            <Toaster position="top-center" richColors closeButton />
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  در حال بارگذاری...
                </div>
              }
            ></Suspense>
            {/* <CompleteFramerMotionDemo/> */}
            <Loading />
            <Routes>
              <Route path="/auth/" element={<Auth />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/search" element={<ProductSearch />} />
              <Route path="/scan" element={<ScanProduct />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
