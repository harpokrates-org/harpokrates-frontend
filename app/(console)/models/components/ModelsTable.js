"use client";
import { getUserModels } from "@/app/api/UserAPI";
import {
  changeModels,
  selectEmail,
  selectModels,
} from "@/store/HarpokratesUserSlice";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  { field: "_id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Modelo", width: 160 },
  { field: "url", headerName: "URL", width: 600 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ModelsTable() {
  const [rows, setRows] = useState();
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);
  const models = useSelector(selectModels);

  const setRowSelectionModel = (rowIDs) => {
    console.log(rowIDs);
  };

  useEffect(() => {
    const fetchModels = async () => {
      const data = await getUserModels(email);
      const _models = data.models.map(model => {
        return {
          id: model._id,
          name: model.name,
          url: model.url
        }
      })
      dispatch(changeModels(_models));
    };
    fetchModels();
  }, []);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={models}
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