import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLog, selectLogs } from "../../store/logs";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { addDraft } from "../../store/drafts";

// Import components individually
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Edit3, Plus } from "lucide-react";

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
    const id = nanoid();
    dispatch(addDraft(id));
    navigate(`/drafts/${id}`);
  };

  return (
    <div className="container mx-auto my-4">
      {/* Filters Section */}
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-32"
        >
          <option value="">All</option>
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="secondary"
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
          <Plus size={16} /> Add Draft
        </Button>
      </div>
      {/* Logs Table */}
      <Table>
        <TableCaption>Service Logs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Order Number</TableCell>
            <TableCell>Equipment</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Engine Hours</TableCell>
            <TableCell>Odometer</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.orderNumber}</TableCell>
              <TableCell>{log.equipment}</TableCell>
              <TableCell>{log.driver}</TableCell>
              <TableCell className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
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
              </TableCell>
              <TableCell>{log.provider}</TableCell>
              <TableCell>{log.startDate}</TableCell>
              <TableCell>{log.endDate}</TableCell>
              <TableCell>{log.engineHours}</TableCell>
              <TableCell>{log.odometer} mi</TableCell>
              <TableCell>{log.totalAmount}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(deleteLog(log.id))}
                >
                  <Trash size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert("This feature is not yet implemented")}
                >
                  <Edit3 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsPage;
