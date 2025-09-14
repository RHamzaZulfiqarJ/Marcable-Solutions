import express from 'express'
import { getWebhookEvents, postWebhookEvents } from '../controllers/webhooks.js'

const router = express.Router()

router.get('/', getWebhookEvents)
router.post('/', postWebhookEvents)

export default router