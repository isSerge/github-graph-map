import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GraphPage from "./pages/GraphPage";

const GraphRouter = () => {
  const location = useLocation();
  // Remove the leading slash and trim any extra spaces.
  const query = location.pathname.slice(1).trim();
  // If no query exists, render the HomePage.
  return query ? <GraphPage query={query} /> : <HomePage />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<GraphRouter />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;