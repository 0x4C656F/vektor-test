import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import DraftsPage from "./pages/drafts";
import Layout from "./pages/layout";
import LogsPage from "./pages/service-logs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="drafts/:id" element={<DraftPageWrapper />} />
        <Route path="drafts" element={<DraftsPage />} />
      </Route>

      <Route path="logs" index element={<LogsPage />} />
      <Route index element={<LogsPage />} />
    </Routes>
  );
}
const DraftPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <DraftsPage key={id} />;
};
export default App;
