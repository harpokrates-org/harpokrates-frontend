"use client";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getUserModels } from "@/app/api/UserAPI";
import { useSelector } from "react-redux";
import { selectEmail } from "@/store/HarpokratesUserSlice";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Modelo", width: 160 },
  { field: "url", headerName: "URL", width: 600 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ModelsTable() {
  const [rows, setRows] = useState();
  const [models, setModels] = useState();

  const email = useSelector(selectEmail);

  const setRowSelectionModel = (rowIDs) => {
    console.log(rowIDs)
  }

  useEffect(() => {
    const fetchModels = async () => {
      const data = await getUserModels(email);
      const _rows = data.models.map(model => {
        return {
          id: model._id,
          name: model.modelName,
          url: model.modelURL
        }
      })
      setRows(_rows)
    };
    fetchModels()
  }, []);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
      />
    </Paper>
  );
}
