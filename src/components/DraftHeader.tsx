import { AppBar, Tabs, Tab } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addDraft, clearDrafts } from "../store/drafts";

interface DraftHeaderProps {
  drafts: { id: string }[];
}

const DraftHeader: React.FC<DraftHeaderProps> = ({ drafts }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateDraft = () => {
    const id = nanoid();
    dispatch(addDraft(id));
    navigate(`/drafts/${id}`);
  };

  const currentTabValue = drafts.some(
    (draft) => location.pathname === `/drafts/${draft.id}`,
  )
    ? location.pathname
    : false;

  return (
    <AppBar position="static" color="default">
      <Tabs
        value={currentTabValue}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="draft tabs"
      >
        {drafts.map((draft, i) => (
          <Tab
            key={draft.id}
            label={`Draft ${i + 1}`}
            value={`/drafts/${draft.id}`}
            component={Link}
            to={`/drafts/${draft.id}`}
          />
        ))}
        <Tab
          icon={<AddIcon />}
          aria-label="Create New Draft"
          onClick={handleCreateDraft}
        />
        <Tab label="Remove all" onClick={() => dispatch(clearDrafts())} />
        <Tab label="To logs" component={Link} to={"/logs"} />
      </Tabs>
    </AppBar>
  );
};

export default DraftHeader;
