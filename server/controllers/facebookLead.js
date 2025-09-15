import User from "../models/user.js";
import FbLead from "../models/facebookLead.js";
import FacebookEvent from "../models/facebookEvent.js";

export const getAllFacebookLeads = async (req, res) => {
  try {
    const events = await FbLead.find().lean();

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching Facebook leads:", error);
    res.status(500).json({ message: "Error fetching Facebook leads" });
  }
}

export const getPendingFacebookLeads = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const eventIds = user.events?.filter((ev) => ev.status === "pending").map((ev) => ev.id);

    if (!eventIds?.length) {
      return res.status(200).json({ events: [] });
    }

    const leads = await FbLead.find({
      _id: { $in: eventIds },
      status: "pending",
      expired: false
    }).lean();

    const filteredEvents = user.events
      ?.filter((ev) =>
        leads.some((lead) => String(lead._id) === String(ev.id) && ev.status === "pending")
      )
      ?.map((ev) => ({
        ...ev,
        id: leads.find((lead) => String(lead._id) === String(ev.id)) || ev.id,
      }));

    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching Facebook leads:", error);
    res.status(500).json({ message: "Error fetching Facebook leads" });
  }
};

export const getAcceptedFacebookLeads = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const eventIds = user.events.filter((ev) => ev.status === "accepted").map((ev) => ev.id);

    if (!eventIds.length) {
      return res.status(200).json({ events: [] });
    }

    const leads = await FbLead.find({
      _id: { $in: eventIds },
      status: "accepted",
      expired: false
    }).lean();

    const filteredEvents = user.events
      .filter((ev) =>
        leads.some((lead) => String(lead._id) === String(ev.id) && ev.status === "accepted")
      )
      .map((ev) => ({
        ...ev,
        id: leads.find((lead) => String(lead._id) === String(ev.id)) || ev.id,
      }));

    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching Facebook leads:", error);
    res.status(500).json({ message: "Error fetching Facebook leads" });
  }
};

export const getRejectedFacebookLeads = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const eventIds = user.events.filter((ev) => ev.status === "rejected").map((ev) => ev.id);

    if (!eventIds.length) {
      return res.status(200).json({ events: [] });
    }

    const leads = await FbLead.find({
      _id: { $in: eventIds },
      status: { $in: ["pending", "rejected", "accepted"] },
      expired: false
    }).lean();

    const filteredEvents = user.events
      .filter((ev) =>
        leads.some(
          (lead) =>
            String(lead._id) === String(ev.id) &&
            (ev.status === "rejected" || ev.status === "pending" || ev.status === "accepted")
        )
      )
      .map((ev) => ({
        ...ev,
        id: leads.find((lead) => String(lead._id) === String(ev.id)) || ev.id,
      }));

    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching Facebook leads:", error);
    res.status(500).json({ message: "Error fetching Facebook leads" });
  }
};

export const acceptFacebookLead = async (req, res) => {
  try {
    const { userId, leadId } = req.params;

    const lead = await FbLead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (lead.status === "accepted") {
      return res.status(400).json({ message: "Lead already accepted" });
    }

    lead.status = "accepted";
    await lead.save();

    const user = await User.findOneAndUpdate(
      { _id: userId, "events.id": leadId },
      { $set: { "events.$.status": "accepted" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found or event missing" });
    }

    const userWithPendingEvents = await User.findById(userId);
    const hasPendingEvents = userWithPendingEvents.events.some(ev => ev.status === "pending");

    if (!hasPendingEvents) {
      await FacebookEvent.deleteMany({ userId: userId }); // delete only this user's events
    }

    res.status(200).json({
      message: `Lead ${leadId} accepted by user ${userId}`,
      lead,
      user,
    });
  } catch (error) {
    console.error("Error accepting Facebook lead:", error);
    res.status(500).json({ message: "Error accepting Facebook lead" });
  }
};

export const rejectFacebookLead = async (req, res) => {
  try {
    const { userId, leadId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: userId, "events.id": leadId },
      { $set: { "events.$.status": "rejected" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Lead Rejected by user`,
      user: user,
    });
  } catch (error) {
    console.error("Error rejecting Facebook lead:", error);
    res.status(500).json({ message: "Error rejecting Facebook lead" });
  }
};

export const deleteFacebookLead = async (req, res) => {
  try {
    const { leadId, userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { events: { id: leadId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Lead ${leadId} removed from user ${userId}'s events`,
      events: user.events,
    });
  } catch (error) {
    console.error("Error deleting Facebook lead:", error);
    res.status(500).json({ message: "Error deleting Facebook lead" });
  }
};

export const facebookLeadDeletion = async () => {
  try {
    const now = new Date();

    const expiredLeads = await FbLead.find({
      createdTime: { $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
    });

    for (const lead of expiredLeads) {
      if (lead.status === "accepted") {
        continue;
      }

      if (lead.status === "pending") {
        expiredLeads.expired = true;
        await FbLead.save();
      }
    }

    console.log("✅ Cron: expired leads checked");
  } catch (err) {
    console.error("❌ Error in cron job:", err);
  }
}

export const deleteFacebookLeadFromDB = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await FbLead.findByIdAndRemove(leadId);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting Facebook lead:", error);
    res.status(500).json({ message: "Error deleting Facebook lead" });
  }
}