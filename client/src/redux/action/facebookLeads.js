import { useSelector } from "react-redux";
import * as api from "../api";
import {
  start,
  end,
  getAcceptedLeadsReducer,
  getPendingLeadsReducer,
  getRejectedLeadsReducer,
  acceptLeadsReducer,
  rejectLeadsReducer,
  deleteLeadsReducer,
  error,
} from "../reducer/facebookLeads";

export const getPendingLeads = (userId) => async (dispatch) => {
  try {
    dispatch(start());
    const response = await api.getPendingFacebookLeads(userId);
    dispatch(getPendingLeadsReducer(response.data));
    dispatch(end());
  } catch (err) {
    dispatch(error(err.message));
  }
}

export const getAcceptedLeads = (userId) => async (dispatch) => {
  try {
    dispatch(start());
    const response = await api.getAcceptedFacebookLeads(userId);
    dispatch(getAcceptedLeadsReducer(response.data));
    dispatch(end());
  } catch (err) {
    dispatch(error(err.message));
  }
}

export const getRejectedLeads = (userId) => async (dispatch) => {
  try {
    dispatch(start());
    const response = await api.getRejectedFacebookLeads(userId);
    dispatch(getRejectedLeadsReducer(response.data));
    dispatch(end());
  } catch (err) {
    dispatch(error(err.message));
  }
}

export const acceptLead = (userId, leadId) => async (dispatch) => {
  try {
    dispatch(start());
    const response = await api.acceptFacebookLead(userId, leadId);
    dispatch(acceptLeadsReducer(response.data));
    dispatch(end());
  } catch (err) {
    dispatch(error(err.message));
  }
}

export const rejectLead = (userId, leadId) => async (dispatch) => {
  try {
    dispatch(start());
    const response = await api.rejectFacebookLead(userId, leadId);
    dispatch(rejectLeadsReducer(response.data));
    dispatch(end());
  } catch (err) {
    dispatch(error(err.message));
  }
}

export const deleteLead = (userId, leadId) => async (dispatch) => {
    try {
        dispatch(start())
        const { data } = await api.deleteFacebookLead(userId, leadId)
        dispatch(deleteLeadsReducer(data.result))
        dispatch(end())
    } catch (err) {
        dispatch(error(err.message))
    }
}