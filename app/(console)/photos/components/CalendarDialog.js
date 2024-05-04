'use client';
import {
  Button,
  Dialog,
} from '@mui/material';
import { DateRange } from 'react-date-range';


export default function CalendarDialog({ dateRange, maxDate, open, onChange, onClose }) {

  const closeHandler = () => {
    onClose()
  };

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          maxWidth: '100vw',
        }
      }}
    >
      <DateRange
        editableDateInputs={true}
        onChange={item => onChange({
          minDate: item.selection.startDate.toISOString(),
          maxDate: item.selection.endDate.toISOString()
        })}
        moveRangeOnFirstSelection={false}
        ranges={[{
          startDate: new Date(dateRange.minDate),
          endDate: new Date(dateRange.maxDate),
          key: 'selection'
        }]}
        maxDate={maxDate}
      />
      <Button type="submit" onClick={onClose}>
        Aceptar
      </Button>
    </Dialog>
  );
}
