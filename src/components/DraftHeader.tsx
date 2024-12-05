import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addDraft } from "../store/drafts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  return (
    <div className="relative gap-2 flex items-center h-10  px-4  bg-slate-900">
      {drafts.map((draft, index) => {
        const isActive = location.pathname === `/drafts/${draft.id}`;
        return (
          <Link
            key={draft.id}
            to={`/drafts/${draft.id}`}
            className={`relative px-4 py-2 transition-all  rounded-t-lg  border-border flex items-center justify-center ${
              isActive ? `bg-background z-10 border-b-0 ` : "bg-slate-900 z-0"
            }`}
            style={{
              zIndex: drafts.length - index,
            }}
          >
            Draft {index + 1}
          </Link>
        );
      })}
      <Button onClick={handleCreateDraft} variant="ghost" size="icon">
        <Plus />
      </Button>
    </div>
  );
};

export default DraftHeader;
