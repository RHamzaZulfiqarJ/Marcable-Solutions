import express from 'express';
import { getAllFacebookLeads, getPendingFacebookLeads, getAcceptedFacebookLeads, getRejectedFacebookLeads, rejectFacebookLead, acceptFacebookLead, deleteFacebookLead, deleteFacebookLeadFromDB } from '../controllers/facebookLead.js';
import { verifySuperAdmin, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/get/all', getAllFacebookLeads, verifySuperAdmin, verifyToken);

router.get('/get/pending/:userId', getPendingFacebookLeads, verifyToken);
router.get('/get/accepted/:userId', getAcceptedFacebookLeads, verifyToken);
router.get('/get/rejected/:userId', getRejectedFacebookLeads, verifyToken);

router.post('/accept/:userId/:leadId', acceptFacebookLead, verifyToken);
router.post('/reject/:userId/:leadId', rejectFacebookLead, verifyToken);
router.post('/delete/:userId/:leadId', deleteFacebookLead, verifyToken);

router.delete('/delete/:leadId', deleteFacebookLeadFromDB, verifySuperAdmin, verifyToken);

export default router;