'use client';

import { DataTable } from "@/components/Shared/DataTable/DataTable"
import { DataTableColumnHeader } from "@/components/Shared/DataTable/DataTableColumnHeader";
import { ColumnDef, ColumnFiltersState, Row, SortingState } from "@tanstack/react-table"
import { useState } from "react";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { axiosClient } from "@/lib/axios-client";
import React from "react";
import { DataTableRow } from "@/components/Shared/DataTable/DataTableRow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";

export interface Ticket {
  ticket_id: string
  requester: string
  request: string
  created_at: string
  updated_at: string
  priority: string
  subcategory: {
    subcategory_id: string,
    name: string,
  }
  assignee: null|{
    id: string,
    name: string
  }
}

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'ticket_id',
    header: (header) => <DataTableColumnHeader column={header.column} title="# Ticket" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>,
    accessorFn: (originalRow) => originalRow.ticket_id.toString(), //prevents it from reading it as number
    meta: {
      exhibition: 'Ticket'
    }
  },
  {
    accessorKey: "requester",
    header: (header) => <DataTableColumnHeader column={header.column} title="Requester" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>,
  },
  {
    id: "subcategory.name",
    accessorKey: "subcategory.name",
    header: (header) => <DataTableColumnHeader column={header.column} title="Category" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>,
    meta: {
      exhibition: 'Category'
    }
  },
  {
    accessorKey: "request",
    header: (header) => <DataTableColumnHeader column={header.column} title="Request" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>
  },
  {
    accessorKey: "priority",
    header: (header) => <DataTableColumnHeader column={header.column} title="Priority" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>
  },
  {
    id: "assignee.name",
    accessorKey: "assignee.name",
    header: (header) => <DataTableColumnHeader column={header.column} title="Assignee" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>,
    meta: {
      exhibition: 'Assignee'
    }
  },
  {
    accessorKey: "created_at",
    header: (header) => <DataTableColumnHeader filterInputType="date" column={header.column} title="Created at" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell} cellType="date"/>,
    meta: {
      exhibition: 'Created'
    }
  },
  {
    accessorKey: "updated_at",
    header: (header) => <DataTableColumnHeader filterInputType="date" column={header.column} title="Last update" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell} cellType="date"/>,
    meta: {
      exhibition: 'Last update'
    }
  },
]

export type TicketApiResponse = {
  data: Ticket[]
  meta: {
    current_page: number,
    total: number,
    last_page: number
  }
}

const queryClient = new QueryClient()

export default function Wrapper({ params }: { params: { department: string } }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
          <Page params={params}/>
        </QueryClientProvider>
    </div>
  )
}

export function Page({ params }: { params: { department: string } }) {
  const ref = React.useRef<HTMLTableSectionElement>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [ticket, setTicket] = React.useState<Ticket|null>(null)

  async function rowClick(row: Row<Ticket>) {
    setShowModal(!showModal)

    let ticketReponse = await axiosClient.get(`/tickets/${row.original.ticket_id}`)

    setTicket(ticketReponse.data.data)
  }

  async function getData(pageParam?: string): Promise<TicketApiResponse> {
    let url = pageParam ? pageParam + `&department=${params.department}` : `/tickets?department=${params.department}`// + (pageParam ? `&page=${pageParam}` : "")
    
    columnFilters.forEach(filter => {
      if(filter.value.value != undefined && filter.value.value != "") {
        url += `&queryParameters[${filter.id}][value]=${filter.value.value}&queryParameters[${filter.id}][operator]=${filter.value.type}`
      }
    })

    sorting?.forEach(sortedField => {
      url += `&sortField[${sortedField.id}]=${sortedField.desc ? 'desc' : 'asc'}`
    })

    let data = await axiosClient.get(url).then(res => {
      return res.data
    });

    return data;
  }

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<TicketApiResponse>(
    ['tickets', sorting, columnFilters],
    async ({ pageParam }) => await getData(pageParam),
    {
      getPreviousPageParam: (firstPage) => firstPage.links.prev ?? undefined,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.links.next ?? undefined,
    },
  )

  const flatData = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) ?? [],
    [data]
  )

  const totalDBRowCount = data?.pages?.[0]?.meta?.total ?? 100
  const totalFetched = flatData.length

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  )

  React.useEffect(() => {
    fetchMoreOnBottomReached(ref.current)
  }, [fetchMoreOnBottomReached])

  return (
    <div className="w-screen h-screen px-4">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          
            {ticket ? (
              <>
                <DialogHeader>
                  <DialogTitle># {ticket.ticket_id}</DialogTitle>
                </DialogHeader>
                <Input className="w-[180px] mb-2 block"/>
              </>
            ) : (
              <div role="status" className="p-10 text-center">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            
          
        </DialogContent>
      </Dialog>
      <QueryClientProvider client={queryClient}>  
        <DataTable
          columns={columns}
          onClick={rowClick}
          setColumnFilters={setColumnFilters}
          columnFilters={columnFilters}
          data={flatData}
          total={totalDBRowCount}
          setSorting={setSorting}
          sorting={sorting}
          isLoading={isLoading}
          isFetching={isFetching}
          infiniteRef={ref}
          fetchMoreOnBottomReached={fetchMoreOnBottomReached}
        />
      </QueryClientProvider>
    </div>
  )
}