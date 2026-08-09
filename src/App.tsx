import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { lazy, Suspense, useLayoutEffect } from "react";
import { store } from "./shared/stores";
import BottomNav from "./shared/components/BottomNav";
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const ProductsList = lazy(() => import("./features/products/ProductsList"));
const ScanProduct = lazy(() => import("./features/scanner/ScanProduct"));
const ProductDetail = lazy(() => import("./features/products/ProductDetail"));
const Settings = lazy(() => import("./features/settings/Settings"));
const Auth = lazy(() => import("./features/auth"));

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
    if (localStorage.getItem("anbarak_theme") === "dark")
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
            <BottomNav />
            <Loading />
            <Routes>
              <Route path="/auth/" element={<Auth />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
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
