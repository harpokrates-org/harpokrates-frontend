"use client";
import {
  Box,
  Button,
  FormControl,
} from "@mui/material";
import { FormHelperText, FormLabel, Input, Option } from "@mui/joy";
import Select, { selectClasses } from '@mui/joy/Select';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarDialog from "./CalendarDialog";
import { selectFilters, setFilters } from "@/store/PhotosFilterSlice";
import { KeyboardArrowDown } from "@mui/icons-material";
import { modelNames } from "@/app/libs/modelIndex";

export const margin = 30;
export const barHeight = 200;
export const titleHeight = 25;
const formItemStyle = { 
  marginLeft:`${margin}px`,
  marginTop:`${margin}px`,
  height:`${titleHeight}`
}

export default function PhotosTopBar() {
  const dispatch = useDispatch();
  const [openCalendar, setOpenCalendar] = useState(false)
  const filters = useSelector(selectFilters)
  const [modelName, setModelName] = useState(filters.modelName)
  const [dateRange, setDateRange] = useState(
    {
      minDate: filters.minDate, 
      maxDate: filters.maxDate,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({...dateRange, modelName}));
  };

  return (
    <Box sx={{ minWidth: 120, height: `${barHeight}px`, backgroundColor: '#f4f4f4', marginBottom: `${margin}px`}}>
      <FormControl>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={formItemStyle}>
            <FormLabel >
              Fecha de publicación
            </FormLabel>
            <Input
              readOnly={true}
              endDecorator={
                <Button onClick={() => setOpenCalendar(true)}>Seleccionar</Button>
              }
              size="sm"
              value={`${dateRange.minDate.split('T')[0]} / ${dateRange.maxDate.split('T')[0]}`}
            />
            <CalendarDialog open={openCalendar} onClose={() => setOpenCalendar(false)} dateRange={dateRange} maxDate={new Date()} onChange={setDateRange} />
            <FormHelperText >
              Seleccione un rango de fechas.
            </FormHelperText>
          </div>

          <div style={formItemStyle}>
            <FormLabel >
              Modelo clasificador
            </FormLabel>
            <Select
              onChange={(event, newModelName) => {
                setModelName(newModelName);
              }}
              indicator={<KeyboardArrowDown />}
              value={modelName}
              sx={{
                width: 270,
                [`& .${selectClasses.indicator}`]: {
                  transition: '0.2s',
                  [`&.${selectClasses.expanded}`]: {
                    transform: 'rotate(-180deg)',
                  },
                },
              }}
            >
              <Option value={modelNames.NO_MODEL}>No clasificar</Option>
              <Option value={modelNames.LOW_MODEL}>Base</Option>
            </Select>
            <FormHelperText >
              CNN para estegoanálisis de imagenes.
            </FormHelperText>
          </div>
        </div>

        <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ margin: `${margin}px`, width: '80px' }}>
          Aplicar
        </Button>
    </FormControl>
    </Box>
  );
}
