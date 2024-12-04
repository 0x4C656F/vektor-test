import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const ONE_DAY = 86400000;

type Draft = {
  id: string;
  providerId?: string;
  serviceOrder?: string;
  truckIdOrTrailer?: string;
  odometer?: number;
  engineHours?: number;
  startDate?: string;
  endDate?: string;
  type?: DraftType;
  serviceDescription?: string;
};

enum DraftType {
  PLANNED = "planned",
  UNPLANNED = "unplanned",
  EMERGENCY = "emergency",
}

interface DraftsState {
  drafts: Record<string, Draft>;
}

const initialState: DraftsState = {
  drafts: {},
};

function addDraftToLocalStorage(draft: Draft) {
  const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
  drafts.push(draft);
  localStorage.setItem("drafts", JSON.stringify(drafts));
}

function updateDraftInLocalStorage(draft: Draft) {
  const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
  const index = drafts.findIndex((d: Draft) => d.id === draft.id);
  drafts[index] = draft;
  localStorage.setItem("drafts", JSON.stringify(drafts));
}

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    addDraft: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.drafts[id] = {
        id,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + ONE_DAY).toISOString().split("T")[0],
      };
      addDraftToLocalStorage(state.drafts[id]);
    },
    updateDraft: (state, action: PayloadAction<Draft>) => {
      const { id, ...data } = action.payload;
      if (state.drafts[id]) {
        state.drafts[id] = { ...state.drafts[id], ...data };
      }
      updateDraftInLocalStorage(action.payload);
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      delete state.drafts[action.payload];
    },
    clearDrafts: (state) => {
      state.drafts = {};
    },
  },
});

export const { addDraft, updateDraft, deleteDraft, clearDrafts } =
  draftsSlice.actions;

export default draftsSlice.reducer;
