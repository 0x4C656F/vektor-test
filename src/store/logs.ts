import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Draft } from "./drafts";

export enum LogType {
  PLANNED = "planned",
  UNPLANNED = "unplanned",
  EMERGENCY = "emergency",
}

type Log = {
  id: string;
  orderNumber: string;
  equipment: string;
  driver: string;
  type: LogType;
  provider: string;
  startDate: string;
  endDate: string;
  engineHours: number;
  odometer: number;
  totalAmount: string;
  lastService: string;
  solvedDefects: string;
  files: string[];
};

interface LogsState {
  logs: Log[];
}

const LOCAL_STORAGE_KEY = "logs";

function getLogsFromLocalStorage(): Log[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLogsToLocalStorage(logs: Log[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
}

const initialState: LogsState = {
  logs: getLogsFromLocalStorage(),
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    createLogFromDraft(state, action: PayloadAction<Draft>) {
      const draft = action.payload;
      const newLog: Log = {
        id: draft.id,
        orderNumber: draft.serviceOrder || "N/A",
        equipment: draft.truckIdOrTrailer || "Unknown",
        driver: "Unknown",
        type: draft.type!,
        provider: draft.providerId || "Unknown",
        startDate: draft.startDate!,
        endDate: draft.endDate!,
        engineHours: draft.engineHours!,
        odometer: draft.odometer!,
        totalAmount: "$0.00",
        lastService: "-",
        solvedDefects: "-",
        files: [],
      };
      state.logs.push(newLog);
      saveLogsToLocalStorage(state.logs);
    },

    deleteLog(state, action: PayloadAction<string>) {
      const logId = action.payload;
      state.logs = state.logs.filter((log) => log.id !== logId);
      saveLogsToLocalStorage(state.logs);
    },
  },
});

export const { createLogFromDraft, deleteLog } = logsSlice.actions;
export const selectLogs = (state: RootState) => state.logs.logs;
export default logsSlice.reducer;
