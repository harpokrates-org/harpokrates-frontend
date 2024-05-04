"use client";
import {
  Box,
  Button,
  FormControl,
  Typography,
} from "@mui/material";
import { Input } from "@mui/joy";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarDialog from "./CalendarDialog";
import { selectMaxDate, selectMinDate, setDates } from "@/store/PhotosFilterSlice";

export const margin = 4;

export default function PhotosTopBar() {
  const dispatch = useDispatch();
  const [openCalendar, setOpenCalendar] = useState(false)
  const [dateRange, setDateRange] = useState(
    {
      startDate: useSelector(selectMinDate), 
      endDate: useSelector(selectMaxDate),
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setDates(dateRange.startDate, dateRange.endDate));
  };

  return (
    <Box sx={{ minWidth: 120, backgroundColor: '#f4f4f4'}}>
      <FormControl>
        <Typography variant="h6" marginLeft={margin}>Fecha de publicación</Typography>
        <Input
          sx={{ marginLeft: margin }}
          readOnly={true}
          endDecorator={
            <Button onClick={() => setOpenCalendar(true)}>Seleccionar</Button>
          }
          size="sm"
          value={`${dateRange.startDate.split('T')[0]} / ${dateRange.endDate.split('T')[0]}`}
        ></Input>
        <CalendarDialog open={openCalendar} onClose={() => setOpenCalendar(false)} dateRange={dateRange} maxDate={new Date()} onChange={setDateRange} />
        <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ margin: margin, width: '80px' }}>
          Aplicar
        </Button>
    </FormControl>
    </Box>
  );
}
