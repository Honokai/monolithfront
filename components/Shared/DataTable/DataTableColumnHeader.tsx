import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"

import { Column } from "@tanstack/react-table"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"



interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  filterInput?: "select"|"input"
  filterInputValues?: string
  filterInputType?: "number"|"text"|"date"
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  filterInputType
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout>()
  const [operator, setOperator] = useState<string>('contains')
  const [value, setValue] = useState<string|Date>('')

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  function handleInputChange(value: string|Date) {
    clearTimeout(updateTimeout)
    setValue(value);
    let newTimeout = setTimeout(() => {
      column.setFilterValue(value ? {
        value: typeof value == 'object' ? new Date(value.toString()).toISOString().slice(0, 10) : value,
        type: operator
      } : '')
    }, 500)

    setUpdateTimeout(newTimeout)
  }

  return (
      <div className={cn("flex flex-col items-start", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 hover:bg-accent-none"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {column.getCanFilter() && (
          <div className="[&>button]:mb-2">
            {
              filterInputType == "date" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !value && "text-muted-foreground"
                      )}
                    >
                      {value ? (
                        format(value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={column.getFilterValue()?.value}
                      onSelect={(date) => handleInputChange(date ?? "")}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Select
                    onValueChange={(value) => setOperator(value)}
                    defaultValue={operator}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Filter type</SelectLabel>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Equal</SelectItem>
                        <SelectItem value="starts_with">Starts with</SelectItem>
                        <SelectItem value="ends_with">Ends with</SelectItem>
                        {/* <SelectItem value="">Pineapple</SelectItem> */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input type={filterInputType} className="w-[180px] mb-2 block" defaultValue={ column.getFilterValue()?.value as string ?? "" } onChange={event => handleInputChange(event.target.value)}/>
                </>
              )
            }
          </div>
        )}
      </div>
  )
}
