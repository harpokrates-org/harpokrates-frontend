"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "modelName", headerName: "Modelo", width: 160 },
  { field: "url", headerName: "URL", width: 600 },
];

const rows = [
  {
    id: 1,
    modelName: "MobileNet-Stego",
    url: "https://www.kaggle.com/models/vbravo/mobilenet-stego/TfJs/default/1",
  },
  {
    id: 2,
    modelName: "EfficientNet-Stego",
    url: "https://www.kaggle.com/models/vbravo/mobilenet-stego/TfJs/default/1",
  },
  {
    id: 3,
    modelName: "ResNet-Stego",
    url: "https://www.kaggle.com/models/vbravo/mobilenet-stego/TfJs/default/1",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ModelsTable() {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
