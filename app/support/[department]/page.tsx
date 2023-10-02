'use client';

import { DataTable } from "@/components/Shared/DataTable/DataTable"
import { DataTableColumnHeader } from "@/components/Shared/DataTable/DataTableColumnHeader";
import { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { useState } from "react";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { axiosClient } from "@/lib/axios-client";
import { DataTableRow } from "@/components/Shared/DataTable/DataTableRow";
import React from "react";

interface Ticket {
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

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'ticket_id',
    header: (header) => <DataTableColumnHeader column={header.column} title="# Ticket" />,
    cell: (cell) => <DataTableRow cellInfo={cell.cell}/>,
    accessorFn: (originalRow) => originalRow.ticket_id.toString(), //prevents it to reading it as number
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

  async function getData(pageParam?: string): Promise<TicketApiResponse> {
    // const start = pageParam * fetchSize
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

  const {
    // status,
    // data,
    // fetchNextPage,
    // fetchPreviousPage,
    // hasNextPage,
    // hasPreviousPage,
    // isFetching,
    // isFetchingNextPage,
    // isFetchingPreviousPage,
    // ...result
    data, fetchNextPage, isFetching, isLoading
  } = useInfiniteQuery<TicketApiResponse>(
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

  React.useEffect(()=>{
    console.log(columnFilters)
  }, [columnFilters])

  return (
    <div className="w-screen h-screen px-4">
      <QueryClientProvider client={queryClient}>  
        <DataTable
          columns={columns}
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