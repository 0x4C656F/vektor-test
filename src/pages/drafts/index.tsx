import React, { useEffect, useState } from "react";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { updateDraft, deleteDraft, Draft } from "../../store/drafts";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Container,
  Button,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { Delete, Done } from "@mui/icons-material";
import { createLogFromDraft } from "../../store/logs";

const DraftPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const draft = useSelector((state: RootState) => state.drafts.drafts[id!]);

  const [formValues, setFormValues] = useState<Draft>(draft || {});
  const [status, setStatus] = useState("Saved");
  const [saveTimeout, setSaveTimeout] = useState<number | null>(null);

  useEffect(() => {
    if (draft) {
      setFormValues(draft);
    }
  }, [draft]);

  const saveDraft = (updatedValues: Draft) => {
    if (!id) return;

    setStatus("Saving...");
    dispatch(updateDraft({ ...updatedValues, id }));
    setStatus("Saved");
  };

  const handleChange = (
    e:
      | SelectChangeEvent
      | React.ChangeEvent<
          | HTMLInputElement
          | HTMLTextAreaElement
          | { name?: string; value: unknown }
        >,
  ) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name!]: value };
    setFormValues(updatedValues);
    setStatus("Saving...");

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    setSaveTimeout(
      setTimeout(() => {
        saveDraft(updatedValues);
        setStatus("Saved");
      }, 2000),
    );
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id) return;
    const newStartDate = e.target.value;
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 1);

    const updatedValues = {
      ...formValues,
      startDate: newStartDate,
      endDate: newEndDate.toISOString().split("T")[0],
    };
    setFormValues(updatedValues);
    setStatus("Saving...");

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    setSaveTimeout(
      setTimeout(() => {
        saveDraft(updatedValues);
        setStatus("Saved");
      }, 2000),
    );
  };

  if (!draft || !id) {
    return <DraftNotFound />;
  }
  // imho, tailwindcss + any ui lib would be more readable then MUI.
  // This shi feels like react native
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          mx: 0,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
            }}
          >
            <EmojiTransportationIcon fontSize="large" />
            Provider
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              label="Provider ID"
              name="providerId"
              required
              value={formValues.providerId || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Service Order"
              name="serviceOrder"
              required
              value={formValues.serviceOrder || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
            }}
          >
            <LocalShippingIcon fontSize="large" />
            Transport
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Truck ID or Trailer"
              name="truckIdOrTrailer"
              required
              value={formValues.truckIdOrTrailer || ""}
              onChange={handleChange}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Odometer (mi)"
                name="odometer"
                type="number"
                required
                value={formValues.odometer || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Engine Hours"
                name="engineHours"
                required
                type="number"
                value={formValues.engineHours || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
            }}
          >
            <PendingActionsIcon fontSize="large" />
            Service
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formValues.startDate || ""}
              required
              onChange={handleStartDateChange}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formValues.endDate || ""}
              slotProps={{ inputLabel: { shrink: true } }}
              disabled
              fullWidth
            />
          </Box>
          <FormControl required fullWidth>
            <Select
              labelId="type-label"
              name="type"
              required
              value={formValues.type || "planned"}
              onChange={handleChange}
            >
              <MenuItem value="planned">Planned</MenuItem>
              <MenuItem value="unplanned">Unplanned</MenuItem>
              <MenuItem value="emergency">Emergency</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Service Description"
            name="serviceDescription"
            value={formValues.serviceDescription || ""}
            onChange={handleChange}
            multiline
            required
            rows={4}
            fullWidth
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
            <RemoveDraftButton handler={() => dispatch(deleteDraft(id))} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                if (isFormValid(formValues)) {
                  dispatch(createLogFromDraft(formValues));
                  dispatch(deleteDraft(id));
                  navigate("/logs");
                } else {
                  setStatus("Please fill in all required fields.");
                }
              }}
              disabled={!isFormValid(formValues)}
            >
              Create log
            </Button>
            <Typography
              sx={{
                display: "flex",
                p: 1,
              }}
              variant="body2"
            >
              {status === "Saved" ? <Done fontSize="small" /> : ""}
              {status}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

function DraftNotFound() {
  return (
    <Box sx={{ p: "24px" }}>
      <Typography variant="h4">No draft selected</Typography>
      <Typography variant="body1">
        Choose from exiting ones or create new
      </Typography>
    </Box>
  );
}

function RemoveDraftButton({ handler }: { handler: () => void }) {
  // normally, i would request confirmation from user.
  function handleRemove() {
    handler();
  }

  return (
    <IconButton onClick={handleRemove} aria-label="delete" size="small">
      <Delete color="error" fontSize="medium" />
    </IconButton>
  );
}
const isFormValid = (values: Draft): boolean => {
  // I think this can be made via form actions,but i am not sure.
  // cheeky way. Since form submit does not actually submit the form, so built-in
  // validation does not trigger, i had to manually check whether all fields are good.

  // You can't believe how much better forms in svelte are.
  const requiredFields = [
    "providerId",
    "serviceOrder",
    "truckIdOrTrailer",
    "odometer",
    "engineHours",
    "startDate",
    "endDate",
    "type",
    "serviceDescription",
  ];
  return requiredFields.every((field) => !!values[field as keyof Draft]);
};
export default DraftPage;
