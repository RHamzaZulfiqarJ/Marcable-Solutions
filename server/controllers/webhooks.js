import axios from "axios";
import Facebook from "../models/facebook.js";
import FbLead from '../models/facebookLead.js';
import User from '../models/user.js';
import FacebookEvent from "../models/facebookEvent.js";

export const refreshToken = async () => {
  try {
    const data = await Facebook.find().sort({ createdAt: -1 }).limit(1);

    const response = await axios.get("https://graph.facebook.com/v23.0/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: data[0]?.appId || "",
        client_secret: data[0]?.appSecret || "",
        fb_exchange_token: data[0]?.pageAccessToken || "",
      },
    });

    longLivedToken = response.data.access_token;
    console.log("🔄Refreshed Long-Lived Token");

    if (longLivedToken) {
      await Facebook.findByIdAndUpdate(data[0]._id, { pageAccessToken: longLivedToken });
    }

  } catch (error) {
    console.error("❌Error refreshing token:", error.response?.data || error.message);
  }
};

export const getWebhookEvents = async (req, res) => {
  try {
    const data = await Facebook.find().sort({ createdAt: -1 }).limit(1);

    const VERIFY_TOKEN = data[0]?.verifyToken || "";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying webhook" });
  }
};

export const postWebhookEvents = async (req, res) => {
  try {
    const body = req.body;
    const data = await Facebook.find().sort({ createdAt: -1 }).limit(1);

    if (body.entry && body.entry[0].changes) {
      const leadId = body.entry[0].changes[0].value.leadgen_id;

      const response = await axios.get(
        `https://graph.facebook.com/v23.0/${leadId}?access_token=${data[0]?.pageAccessToken || ""}`
      );

      const lead = await FbLead.create({
        leadId: response.data?.id,
        createdTime: new Date(response.data?.created_time),
        field_data:  response.data?.field_data,
        eventTitle: "Facebook Lead",
      });

      await User.updateMany(
        { role: "employee" },
        { $push: { events: { id: lead._id, status: 'pending' } } }
      );

      /* await FacebookEvent.create({
        title: "Facebook Lead",
        description: "There are some leads from Facebook.",
      }); */
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error fetching lead data:", err.response?.data || err.message);
    res.sendStatus(500);
  }
}