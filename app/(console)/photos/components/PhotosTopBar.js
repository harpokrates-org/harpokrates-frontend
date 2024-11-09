"use client";
import { putPreferencies } from "@/app/api/UserAPI";
import { collectModelNames, collectModels } from "@/app/libs/ModelCollection";
import { mustUpdateNetwork, mustUpdatePhotos, resetFavorites } from "@/store/FlickrUserSlice";
import { selectEmail, selectModels } from "@/store/HarpokratesUserSlice";
import { selectFilters, setFilters } from "@/store/PhotosFilterSlice";
import { KeyboardArrowDown } from "@mui/icons-material";
import { FormHelperText, FormLabel, Input, Option } from "@mui/joy";
import Select, { selectClasses } from "@mui/joy/Select";
import { Box, Button, FormControl } from "@mui/material";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CalendarDialog from "./CalendarDialog";

export const margin = 30;
export const barHeight = 200;
export const titleHeight = 25;
const formItemStyle = {
  marginLeft: `${margin}px`,
  marginTop: `${margin}px`,
  height: `${titleHeight}`,
};

export default function PhotosTopBar() {
  const dispatch = useDispatch();
  const [openCalendar, setOpenCalendar] = useState(false);
  const filters = useSelector(selectFilters);
  const email = useSelector(selectEmail);
  const userModels = useSelector(selectModels);
  const [modelName, setModelName] = useState(filters.modelName);
  const [dateRange, setDateRange] = useState({
    minDate: filters.minDate,
    maxDate: filters.maxDate,
  });

  const modelNames = collectModelNames(userModels);
  const models = collectModels(userModels);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datesChanges =
      dateRange.minDate != filters.minDate ||
      dateRange.maxDate != filters.maxDate;
    const modelChanged = filters.modelName != modelName

    dispatch(
      setFilters({
        ...dateRange,
        modelName,
        modelThreshold: models[modelName].threshold || 1,
      })
    );

    if (datesChanges) {
      dispatch(mustUpdatePhotos());
      dispatch(mustUpdateNetwork());
      dispatch(resetFavorites());
    } else if (modelChanged) {
      dispatch(resetFavorites());
    }
  };

  const handleSave = (e) => {
    putPreferencies(email, modelName).then((response) => {
      if (Object.keys(response.preferencies).length === 0) {
        toast.error(
          "No pudimos guardar tus preferencias. Vuelve a intentar más tarde"
        );
        return;
      }
      toast.success("Preferencias guardadas exitosamente");
    });
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        height: `${barHeight}px`,
        backgroundColor: "#f4f4f4",
        marginBottom: `${margin}px`,
      }}
    >
      <FormControl>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={formItemStyle}>
            <FormLabel>Fecha de publicación</FormLabel>
            <Input
              readOnly={true}
              endDecorator={
                <Button onClick={() => setOpenCalendar(true)}>
                  Seleccionar
                </Button>
              }
              size="sm"
              value={`${dateRange.minDate.split("T")[0]} / ${
                dateRange.maxDate.split("T")[0]
              }`}
            />
            <CalendarDialog
              open={openCalendar}
              onClose={() => setOpenCalendar(false)}
              dateRange={dateRange}
              maxDate={new Date()}
              onChange={setDateRange}
            />
            <FormHelperText>Seleccione un rango de fechas.</FormHelperText>
          </div>

          <div style={formItemStyle}>
            <FormLabel>Modelo clasificador</FormLabel>
            <Select
              onChange={(event, newModelName) => {
                setModelName(newModelName);
              }}
              indicator={<KeyboardArrowDown />}
              value={modelName}
              sx={{
                width: 270,
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              {modelNames.map((name) => {
                return (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                );
              })}
            </Select>
            <FormHelperText>
              CNN para estegoanálisis de imagenes.
            </FormHelperText>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            sx={{ margin: `${margin}px`, width: "80px" }}
          >
            Aplicar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            variant="contained"
            sx={{ margin: `${margin}px`, width: "220px" }}
          >
            Guardar preferencias
          </Button>
        </div>
      </FormControl>
    </Box>
  );
}
