import "./App.css";
import { Route, Routes } from "react-router-dom";
import DraftsPage from "./pages/drafts";
import Layout from "./pages/layout";
import LogsPage from "./pages/serviceLogs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Est probitie</div>} />
        <Route path="drafts/:id" element={<DraftsPage />} />
        <Route path="drafts" element={<DraftsPage />} />
      </Route>
      <Route path="logs" element={<LogsPage />} />
    </Routes>
  );
}

export default App;
