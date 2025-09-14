import express from 'express'

import { createFacebookFields, getLatestFacebookFields } from '../controllers/facebook.js'

const router = express.Router()

router.post('/create', createFacebookFields)
router.get('/get', getLatestFacebookFields)

export default router