"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useCallback } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import { useVirtual } from 'react-virtual'
import { Badge } from "@/components/ui/badge"

interface Ticket {
  id: string
  requester: string
  request: string
  assignee?: string
  created_at: string
  updated_at: string
  priority: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>,
  sorting: SortingState,
  total: number,
  isLoading: boolean,
  onClick?: (row: Row<TData>) => void,
  isFetching: boolean,
  columnFilters: ColumnFiltersState,
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
  fetchMoreOnBottomReached: (containerRefElement?: HTMLDivElement | null) => void
  infiniteRef: React.RefObject<HTMLDivElement>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setSorting,
  sorting,
  fetchMoreOnBottomReached,
  isLoading,
  total,
  isFetching,
  columnFilters,
  setColumnFilters,
  infiniteRef,
  onClick
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
    manualSorting: true,
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      // rowSelection,
    },
  })

  // const contextMenu = useCallback()
  
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtual({
    parentRef: infiniteRef,
    size: rows.length,
    overscan: 10,
  })

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0

  return (
    <>
      <div className="mb-2">
        {
          columnFilters.map(filter => (
            <Badge 
              onClick={() => {
                table.getColumn(filter.id)?.setFilterValue('')
              }} 
              className="cursor-pointer p-2" key={crypto.randomUUID()}
            >
              <span className="font-medium">
                {table.getColumn(filter.id)?.columnDef.meta?.exhibition ?? filter.id} {filter.value.type} <span className="font-black">{filter.value.value}</span>
              </span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </Badge>
          ))
        }
      </div>
      <div className="mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <EyeOpenIcon className="mr-2"/> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column?.columnDef?.meta?.exhibition ?? column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="overflow-auto max-h-[80%] rounded-md border pb-2"
        onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={infiniteRef}
      >
        <Table className="relative w-full">
          <TableHeader className="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="relative" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="top-0 px-6 py-3" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-full">
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            { virtualRows.length ? virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<Ticket>
              return (
                <TableRow
                  onContextMenu={(e) =>{}}  
                  onClick={() => onClick && onClick(row)}
                  key={row.id}
                  role="button"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            }) : isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex m-2 text-muted-foreground text-sm">
        <p>Showing {rows.length} from {total}</p>
      </div>
      </>
  )
}
