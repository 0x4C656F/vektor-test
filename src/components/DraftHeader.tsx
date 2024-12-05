import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDraft, clearDrafts } from "../store/drafts";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Trash } from "lucide-react";

interface DraftHeaderProps {
  drafts: { id: string }[];
}

const DraftHeader: React.FC<DraftHeaderProps> = ({ drafts }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateDraft = () => {
    dispatch(addDraft());
  };

  const handleClearAll = () => {
    dispatch(clearDrafts());
  };

  return (
    <div className="relative  justify-between gap-2 flex items-center h-10  px-8   bg-slate-900">
      <div className="flex gap-2">
        {drafts.map((draft) => {
          const isActive = location.pathname === `/drafts/${draft.id}`;
          return (
            <Link
              to={`/drafts/${draft.id}`}
              key={draft.id}
              className={`relative px-4 py-2 transition-all  rounded-t-lg  border-border flex items-center justify-center ${
                isActive
                  ? `bg-background z-10 border-b-0 `
                  : "bg-slate-900 text-foreground/70 z-0"
              }`}
            >
              New Draft
            </Link>
          );
        })}
        <Button onClick={handleCreateDraft} variant="ghost" size="icon">
          <Plus />
        </Button>
        <Button
          onClick={() => {
            navigate("/logs");
          }}
          className="text-foreground/50 flex items-center "
          variant="ghost"
        >
          View logs <ArrowRight className="mt-0.5" />
        </Button>
      </div>
      <Button
        onClick={handleClearAll}
        variant="ghost"
        className="text-foreground/50 "
      >
        <Trash />
        Clear all
      </Button>
    </div>
  );
};

export default DraftHeader;
