import * as api from '../api'
import { start, end, error, createFacebookFields, getFacebookFields } from '../reducer/facebook'

export const fetchFacebookFields = () => async (dispatch) => {
    dispatch(start());
    try {
        const response = await api.getLatestFacebookFields();
        dispatch(getFacebookFields(response.data));
        dispatch(end());
    } catch (err) {
        dispatch(error(err.message));
    }
};

export const createFacebookField = (field) => async (dispatch) => {
    dispatch(start());
    try {
        const response = await api.createFacebookFields(field);
        dispatch(createFacebookFields(response.data));
        dispatch(end());
    } catch (err) {
        dispatch(error(err.message));
    }
};
