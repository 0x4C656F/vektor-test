import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLog, selectLogs } from "../../store/logs";
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
import { Trash, Edit3, Plus, SeparatorVertical } from "lucide-react";
import { nanoid } from "@reduxjs/toolkit";

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
            return (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.orderNumber}</TableCell>
                <TableCell>{log.equipment}</TableCell>
                <TableCell>{log.driver}</TableCell>
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
                <TableCell>{log.provider}</TableCell>
                <TableCell>{log.startDate}</TableCell>
                <TableCell>{log.endDate}</TableCell>
                <TableCell>{log.engineHours}</TableCell>
                <TableCell>{log.odometer} mi</TableCell>
                <TableCell>{log.totalAmount}</TableCell>
                <TableCell className="space-x-2 ">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => dispatch(deleteLog(log.id))}
                  >
                    <Trash size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => alert("This feature is not yet implemented")}
                  >
                    <Edit3 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsPage;
