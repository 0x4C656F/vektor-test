import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLog, Log, selectLogs, updateLog } from "../../store/logs";
import { useNavigate } from "react-router-dom";
import { addDraft } from "../../store/drafts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Edit3, Plus, SeparatorVertical, X, Save } from "lucide-react";
import { Dispatch, nanoid } from "@reduxjs/toolkit";

const LogsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logs = useSelector(selectLogs);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.orderNumber
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType ? log.type === filterType : true;
    const matchesStartDate = startDate
      ? new Date(log.startDate) >= new Date(startDate)
      : true;
    const matchesEndDate = endDate
      ? new Date(log.endDate) <= new Date(endDate)
      : true;
    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });

  const handleCreateDraft = () => {
    let id = nanoid();
    dispatch(addDraft(id));
    navigate(`/drafts/${id}`);
  };

  return (
    <div className="container mx-auto my-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterType || "all"}
          onValueChange={(value) => setFilterType(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter Types</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="unplanned">Unplanned</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <SeparatorVertical />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setFilterType("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Clear Filters
        </Button>
        <Button
          variant="outline"
          onClick={handleCreateDraft}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> New
        </Button>
      </div>
      <Table>
        <TableCaption>Service Logs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Engine Hours</TableHead>
            <TableHead>Odometer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => {
            console.log(log);
            return <LogTableRow dispatch={dispatch} log={log} />;
          })}
        </TableBody>
      </Table>
    </div>
  );
};

function LogTableRow({ log, dispatch }: { log: Log; dispatch: Dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLog, setEditedLog] = useState({ ...log });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedLog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch(updateLog(editedLog));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLog({ ...log });
    setIsEditing(false);
  };

  const renderCell = (
    value: string | number,
    name: string,
    type: "text" | "number" = "text",
  ) => {
    if (isEditing) {
      return (
        <TableCell>
          <Input
            name={name}
            value={editedLog[name as keyof Log] || value}
            onChange={handleInputChange}
            type={type}
            className="w-full"
          />
        </TableCell>
      );
    }
    return (
      <TableCell>
        {value}
        {name === "odometer" ? " mi" : ""}
      </TableCell>
    );
  };
  const handleTypeChange = (value: string) => {
    setEditedLog(
      (prev) =>
        ({
          ...prev,
          type: value,
        }) as Log,
    );
  };
  const renderType = () => {
    if (isEditing) {
      return (
        <TableCell>
          <Select value={editedLog.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-green-500 rounded-full"></span>
                  Planned
                </div>
              </SelectItem>
              <SelectItem value="unplanned">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-orange-500 rounded-full"></span>
                  Unplanned
                </div>
              </SelectItem>
              <SelectItem value="emergency">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-red-500 rounded-full"></span>
                  Emergency
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      );
    }
    return (
      <TableCell>
        <p className="flex gap-2 items-center">
          <span
            className={`size-2 flex rounded-full ${
              log.type === "planned"
                ? "bg-green-500"
                : log.type === "unplanned"
                  ? "bg-orange-500"
                  : log.type === "emergency"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
          ></span>
          {log.type}
        </p>
      </TableCell>
    );
  };

  return (
    <TableRow>
      {renderCell(log.id, "id")}
      {renderCell(log.orderNumber, "orderNumber")}
      {renderCell(log.equipment, "equipment")}
      {renderCell(log.driver, "driver")}
      {renderType()}
      {renderCell(log.provider, "provider")}
      {renderCell(log.startDate, "startDate")}
      {renderCell(log.endDate, "endDate")}
      {renderCell(log.engineHours, "engineHours", "number")}
      {renderCell(log.odometer, "odometer", "number")}
      {renderCell(log.totalAmount, "totalAmount", "number")}
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" onClick={handleSave}>
              <Save size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCancel}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => dispatch(deleteLog(log.id))}
            >
              <Trash size={16} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
export default LogsPage;
