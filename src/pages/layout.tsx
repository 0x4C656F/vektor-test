import { Outlet } from "react-router-dom";
import DraftHeader from "../components/DraftHeader";
import { useSelector } from "react-redux";
import { selectDrafts } from "../store/drafts";

function Layout() {
  const drafts = useSelector(selectDrafts);
  return (
    <div>
      <DraftHeader drafts={drafts} />
      <Outlet />
    </div>
  );
}
export default Layout;
