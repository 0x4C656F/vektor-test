import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import DraftsPage from "./pages/drafts";

const Layout = () => <div></div>;
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route index element={<div>Est probitie</div>} />
      <Route path="drafts/:id" element={<DraftsPage />} />
    </Routes>
  );
}

export default App;
