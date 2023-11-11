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
  responses: null|{
    id: number,
    inquiry: string,
    created_at: string
  }[]
}

export type TicketApiResponse = {
  data: Ticket[]
  meta: {
    current_page: number,
    total: number,
    last_page: number
  }
}