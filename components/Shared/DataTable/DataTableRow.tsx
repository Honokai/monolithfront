import { Cell } from "@tanstack/react-table"

interface DataTableRowProps<TData, TValue> {
  cellInfo: Cell<TData, TValue>
  cellType?: 'text'|'date'
}

export function DataTableRow<TData, TValue>({ cellInfo, cellType }: DataTableRowProps<TData, TValue>) {
  return (
    <div className={`${cellType != 'date' && 'line-clamp-1'}`}>
      { 
        cellType == 'date' ? 
          new Date(cellInfo.getValue() as string).toLocaleString() : 
          cellInfo.getValue() as string 
      }
    </div>
  )
}