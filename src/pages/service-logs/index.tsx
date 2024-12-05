import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLog, selectLogs } from "../../store/logs";
import {
  Box,
  TextField,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Add from "@mui/icons-material/Add";
import { nanoid } from "nanoid";
import { addDraft } from "../../store/drafts";
import { useNavigate } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";

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

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "orderNumber", headerName: "Order Number", width: 200 },
    { field: "equipment", headerName: "Equipment", width: 200 },
    { field: "driver", headerName: "Driver", width: 150 },
    {
      field: "type",
      headerName: "Type",
      width: 130,
      renderCell: (params) => {
        let backgroundColor = "";
        switch (params.value) {
          case "planned":
            backgroundColor = "#4caf50";
            break;
          case "unplanned":
            backgroundColor = "#ff9800";
            break;
          case "emergency":
            backgroundColor = "#f44336";
            break;
          default:
            backgroundColor = "#9e9e9e";
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <div
              style={{
                borderRadius: "4px",
                backgroundColor,
                width: "8px",
                height: "8px",
                position: "relative",
              }}
            ></div>
            {params.value}
          </Box>
        );
      },
    },
    { field: "provider", headerName: "Provider", width: 200 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "engineHours", headerName: "Engine Hours", width: 150 },
    {
      field: "odometer",
      headerName: "Odometer",
      width: 150,
      renderCell: (params) => {
        return <Box>{params.value} mi</Box>;
      },
    },
    { field: "totalAmount", headerName: "Total Amount", width: 150 },
    // Если бы у меня было больше времени, я бы сделал это как дропдаун, в котором были бы все операции с логом. + 100% Конфирмация для удаления, ее делать пару минут.
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            <RemoveLogIconButton
              handler={() => dispatch(deleteLog(params.id.toString()))}
            />
            <EditLogIconButton />
          </Box>
        );
      },
    },
  ];

  const handleCreateDraft = () => {
    const id = nanoid();
    dispatch(addDraft(id));
    navigate(`/drafts/${id}`);
  };
  return (
    <Container
      maxWidth={false}
      sx={{
        my: 4,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        mx: 0,
      }}
    >
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ width: "10%" }}>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="planned">Planned</MenuItem>
            <MenuItem value="unplanned">Unplanned</MenuItem>
            <MenuItem value="emergency">Emergency</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="text"
          size="small"
          color="secondary"
          onClick={() => {
            setSearch("");
            setFilterType("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Clear Filters
        </Button>
        <IconButton onClick={handleCreateDraft}>
          <Add />
        </IconButton>
      </Box>
      <Box style={{ height: 600, width: "100%" }}>
        <DataGrid rows={filteredLogs} columns={columns} />
      </Box>
    </Container>
  );
};

function RemoveLogIconButton({ handler }: { handler: () => void }) {
  return (
    <IconButton onClick={handler}>
      <Delete />
    </IconButton>
  );
}

function EditLogIconButton({}) {
  return (
    <IconButton
      onClick={() => {
        alert("This feature is not yet implemented");
      }}
    >
      <Edit />
    </IconButton>
  );
}

export default LogsPage;
