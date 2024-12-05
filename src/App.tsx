import "./App.css";
import { Route, Routes } from "react-router-dom";
import DraftsPage from "./pages/drafts";
import Layout from "./pages/layout";
import LogsPage from "./pages/service-logs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="drafts/:id" element={<DraftsPage />} />
        <Route path="drafts" index element={<DraftsPage />} />
      </Route>

      <Route path="logs" index element={<LogsPage />} />
    </Routes>
  );
}

export default App;
