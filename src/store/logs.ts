import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
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
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      const defaultLogs: Log[] = [
        {
          id: "1",
          orderNumber: "ORD-3456",
          equipment: "Excavator",
          driver: "John Doe",
          type: LogType.UNPLANNED,
          provider: "HeavyEquip Services",
          startDate: "2024-11-01",
          endDate: "2024-11-03",
          engineHours: 1500,
          odometer: 12500,
          totalAmount: "4500.00",
          lastService: "2024-10-15",
          solvedDefects: "Hydraulic leak repaired",
          files: ["service-report-1.pdf", "invoice-3456.pdf"],
        },
        {
          id: "2",
          orderNumber: "ORD-7890",
          equipment: "Bulldozer",
          driver: "Jane Smith",
          type: LogType.PLANNED,
          provider: "EquipInspect Ltd",
          startDate: "2024-11-05",
          endDate: "2024-11-05",
          engineHours: 2500,
          odometer: 32000,
          totalAmount: "1200.00",
          lastService: "2024-09-20",
          solvedDefects: "None",
          files: ["inspection-report-7890.pdf"],
        },
        {
          id: "3",
          orderNumber: "ORD-5647",
          equipment: "Dump Truck",
          driver: "Mike Johnson",
          type: LogType.EMERGENCY,
          provider: "TruckFix Solutions",
          startDate: "2024-10-20",
          endDate: "2024-10-25",
          engineHours: 1800,
          odometer: 54000,
          totalAmount: "8900.00",
          lastService: "2024-08-10",
          solvedDefects: "Brake system overhaul, replaced tires",
          files: ["repair-summary-5647.pdf", "payment-receipt.pdf"],
        },
      ];
      saveLogsToLocalStorage(defaultLogs);
      return defaultLogs;
    }
  } catch {
    const fallbackLogs: Log[] = [
      {
        id: "1",
        orderNumber: "ORD-3456",
        equipment: "Excavator",
        driver: "John Doe",
        type: LogType.UNPLANNED,
        provider: "HeavyEquip Services",
        startDate: "2024-11-01",
        endDate: "2024-11-03",
        engineHours: 1500,
        odometer: 12500,
        totalAmount: "4500.00",
        lastService: "2024-10-15",
        solvedDefects: "Hydraulic leak repaired",
        files: ["service-report-1.pdf", "invoice-3456.pdf"],
      },
      {
        id: "2",
        orderNumber: "ORD-7890",
        equipment: "Bulldozer",
        driver: "Jane Smith",
        type: LogType.PLANNED,
        provider: "EquipInspect Ltd",
        startDate: "2024-11-05",
        endDate: "2024-11-05",
        engineHours: 2500,
        odometer: 32000,
        totalAmount: "1200.00",
        lastService: "2024-09-20",
        solvedDefects: "None",
        files: ["inspection-report-7890.pdf"],
      },
      {
        id: "3",
        orderNumber: "ORD-5647",
        equipment: "Dump Truck",
        driver: "Mike Johnson",
        type: LogType.EMERGENCY,
        provider: "TruckFix Solutions",
        startDate: "2024-10-20",
        endDate: "2024-10-25",
        engineHours: 1800,
        odometer: 54000,
        totalAmount: "8900.00",
        lastService: "2024-08-10",
        solvedDefects: "Brake system overhaul, replaced tires",
        files: ["repair-summary-5647.pdf", "payment-receipt.pdf"],
      },
    ];
    saveLogsToLocalStorage(fallbackLogs);
    return fallbackLogs;
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
      const id = nanoid();
      const newLog: Log = {
        id,
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
