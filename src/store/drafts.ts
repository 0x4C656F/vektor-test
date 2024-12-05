import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { LogType } from "./logs";

const ONE_DAY = 86400000;

export type Draft = {
  id: string;
  providerId?: string;
  serviceOrder?: string;
  truckIdOrTrailer?: string;
  odometer?: number;
  engineHours?: number;
  startDate?: string;
  endDate?: string;
  type?: LogType;
  serviceDescription?: string;
};

interface DraftsState {
  drafts: Record<string, Draft>;
}

const LOCAL_STORAGE_KEY = "drafts";

function getDraftsFromLocalStorage(): Record<string, Draft> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveDraftsToLocalStorage(drafts: Record<string, Draft>): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
}

const initialState: DraftsState = {
  drafts: getDraftsFromLocalStorage(),
};

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    addDraft(state, action: PayloadAction<string>) {
      const id = action.payload;
      const newDraft: Draft = {
        id,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + ONE_DAY).toISOString().split("T")[0],
      };

      const drafts = { ...state.drafts };
      drafts[id] = newDraft;

      state.drafts = drafts;

      saveDraftsToLocalStorage(drafts);
    },

    updateDraft(state, action: PayloadAction<Draft>) {
      const { id, ...updates } = action.payload;
      if (state.drafts[id]) {
        state.drafts[id] = { ...state.drafts[id], ...updates };
        saveDraftsToLocalStorage(state.drafts);
      }
    },

    deleteDraft(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.drafts[id]) {
        delete state.drafts[id];
        saveDraftsToLocalStorage(state.drafts);
      }
    },

    clearDrafts(state) {
      state.drafts = {};
      saveDraftsToLocalStorage(state.drafts);
    },
  },
});

export const selectDrafts = createSelector(
  (state: RootState) => state.drafts.drafts,
  (drafts) => Object.values(drafts),
);

export const { addDraft, loadDrafts, updateDraft, deleteDraft, clearDrafts } =
  draftsSlice.actions;

export default draftsSlice.reducer;
