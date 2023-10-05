import { Cell } from "@tanstack/react-table"
import moment from 'moment';

interface DataTableRowProps<TData, TValue> {
  cellInfo: Cell<TData, TValue>
  cellType?: 'text'|'date'
}

export function DataTableRow<TData, TValue>({ cellInfo, cellType }: DataTableRowProps<TData, TValue>) {

  return (
    <div className={`${cellType != 'date' && 'line-clamp-1'}`}>
      { 
        cellType == 'date' ? 
          moment.utc(cellInfo.getValue() as string).format("DD/MM/YYYY HH:mm:ss"):
          cellInfo.getValue() as string 
      }
    </div>
  )
}