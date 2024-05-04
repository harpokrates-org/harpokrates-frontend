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
          startDate: item.selection.startDate.toISOString(),
          endDate: item.selection.endDate.toISOString()
        })}
        moveRangeOnFirstSelection={false}
        ranges={[{
          startDate: new Date(dateRange.startDate),
          endDate: new Date(dateRange.endDate),
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
