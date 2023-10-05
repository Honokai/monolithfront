import { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { TicketApiResponse } from "./types"
import { axiosClient } from "./axios-client"


export async function getData(pageParam: string, department: string, columnFilters: ColumnFiltersState, sorting: SortingState): Promise<TicketApiResponse> {
  
  let url = pageParam ? pageParam + `&department=${department}` : `/tickets?department=${department}`// + (pageParam ? `&page=${pageParam}` : "")
  console.log(pageParam)
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