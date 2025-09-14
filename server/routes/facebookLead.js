import express from 'express';
import { getPendingFacebookLeads, getAcceptedFacebookLeads, getRejectedFacebookLeads, rejectFacebookLead, acceptFacebookLead, deleteFacebookLead } from '../controllers/facebookLead.js';

const router = express.Router();

router.get('/get/pending/:userId', getPendingFacebookLeads);
router.get('/get/accepted/:userId', getAcceptedFacebookLeads);
router.get('/get/rejected/:userId', getRejectedFacebookLeads);

router.post('/accept/:userId/:leadId', acceptFacebookLead);
router.post('/reject/:userId/:leadId', rejectFacebookLead);
router.post('/delete/:userId/:leadId', deleteFacebookLead);

export default router;