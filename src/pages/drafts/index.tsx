import { useParams } from "react-router-dom";

function DraftsPage() {
  const id = useParams().id;

  return (
    <div>
      <h1>Drafts Page</h1>
      <p>id: {id}</p>
    </div>
  );
}

export default DraftsPage;
