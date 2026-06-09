import { combineReducers, configureStore } from '@reduxjs/toolkit';
import uploadReducer from './reducer/upload';
import approvalReducer from './reducer/approval';
import eventReducer from './reducer/event';
import notificationReducer from './reducer/notification';
import userReducer from './reducer/user'; // Corrected import name
import taskReducer from './reducer/task';
import saleReducer from './reducer/sale';
import leadReducer from './reducer/lead';
import followUpReducer from './reducer/followUp';
import refundReducer from './reducer/refund';
import cashbookReducer from './reducer/cashbook';
import voucherReducer from './reducer/voucher';
import deductionReducer from './reducer/deduction';
import transcriptReducer from './reducer/transcript';
import societyReducer from './reducer/society';
import projectReducer from './reducer/project';
import inventoryReducer from './reducer/inventory';
import facebookReducer from './reducer/facebook';
import facebookLeadsReducer from './reducer/facebookLeads';

const rootReducer = combineReducers({
    upload: uploadReducer,
    approval: approvalReducer,
    event: eventReducer,
    notification: notificationReducer,
    user: userReducer,
    task: taskReducer,
    sale: saleReducer,
    lead: leadReducer,
    followUp: followUpReducer,
    refund: refundReducer,
    society: societyReducer,
    project: projectReducer,
    inventory: inventoryReducer,
    cashbook: cashbookReducer,
    voucher: voucherReducer,
    deduction: deductionReducer,
    transcript: transcriptReducer,
    facebook: facebookReducer,
    facebookLeads: facebookLeadsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})