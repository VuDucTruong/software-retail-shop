import { ApiClient, Ticket } from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";

import { z } from "zod";
import { create } from "zustand";

const ticketUrl = process.env.NEXT_PUBLIC_N8N_WEB_HOOK ?? ""
const apiClient = ApiClient.getInstance();

type TicketState = {
  lastAction: "createTicket" | null;
  error: string | null;
  status: "idle" | "loading" | "error" | "success";
};

type TicketAction = {
  createTicket: (ticket: Ticket) => Promise<void>;
};

type TicketStore = TicketState & TicketAction;

const initialState: TicketState = {
  lastAction: null,
  error: null,
  status: "idle",
};

export const useTicketStore = create<TicketStore>((set) => ({
    ...initialState,
    createTicket: (ticket) => createTicket(ticket, set),
  }));


const createTicket = async (ticket: Ticket, set: SetState<TicketStore>) => {
  set({ status: "loading", lastAction: "createTicket", error: null });

  try {
    await apiClient.post(ticketUrl , z.any() , ticket, {
      headers: {},
      withCredentials: false,
    })
    set({ status: "success", error: null });
  } catch (error) {
    set({error: ApiError.getMessage(error) , status: "error" });
  }
}
