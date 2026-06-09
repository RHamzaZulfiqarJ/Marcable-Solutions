import { createSlice } from "@reduxjs/toolkit";

const FbLeadSlice = createSlice({
  name: "facebookLead",
  initialState: {
    isFetching: false,
    error: null,
    allLeads: [],
    pendingLeads: [],
    acceptedLeads: [],
    rejectedLeads: [],
  },
  reducers: {
    start: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    end: (state) => {
      state.isFetching = false;
    },
    error: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },

    // GET
    getAllLeadsReducer: (state, action) => {
      state.allLeads = action.payload.events;
      state.isFetching = false;
    },
    getPendingLeadsReducer: (state, action) => {
      state.pendingLeads = action.payload.events;
      state.isFetching = false;
    },
    getAcceptedLeadsReducer: (state, action) => {
      state.acceptedLeads = action.payload.events;
      state.isFetching = false;
    },
    getRejectedLeadsReducer: (state, action) => {
      state.rejectedLeads = action.payload.events;
      state.isFetching = false;
    },

    // ACCEPT
    acceptLeadsReducer: (state, action) => {
      const lead = action.payload;
      state.pendingLeads = state.pendingLeads.filter((l) => l._id !== lead._id);
      state.acceptedLeads.push(lead);
      state.isFetching = false;
    },

    // REJECT
    rejectLeadsReducer: (state, action) => {
      const lead = action.payload;
      state.pendingLeads = state.pendingLeads.filter((l) => l._id !== lead._id);
      state.rejectedLeads.push(lead);
      state.isFetching = false;
    },

    // DELETE
    deleteLeadsReducer: (state, action) => {
      const { events } = action.payload;
      state.pendingLeads = events.filter((ev) => ev.status === "pending");
      state.acceptedLeads = events.filter((ev) => ev.status === "accepted");
      state.rejectedLeads = events.filter((ev) => ev.status === "rejected");
      state.isFetching = false;
    },
    deleteLeadsFromDBReducer: (state, action) => {
      const leadId = action.payload;
      state.pendingLeads = state.pendingLeads.filter((l) => l._id !== leadId);
      state.acceptedLeads = state.acceptedLeads.filter((l) => l._id !== leadId);
      state.rejectedLeads = state.rejectedLeads.filter((l) => l._id !== leadId);
      state.allLeads = state.allLeads.filter((l) => l._id !== leadId);
      state.isFetching = false;
    }
  },
});

export const {
  start,
  end,
  error,
  getAllLeadsReducer,
  getPendingLeadsReducer,
  getAcceptedLeadsReducer,
  getRejectedLeadsReducer,
  acceptLeadsReducer,
  rejectLeadsReducer,
  deleteLeadsReducer,
  deleteLeadsFromDBReducer,
} = FbLeadSlice.actions;

export default FbLeadSlice.reducer;
