import mongoose from 'mongoose'
import FollowUp from '../models/followUp.js'
import { createError } from '../utils/error.js'
import Lead from '../models/lead.js'
import { parse, format, isValid } from 'date-fns'  // Ensure date-fns is installed and imported

export const getFollowUp = async (req, res, next) => {
    try {

        const { followUpId } = req.params
        const findedFollowUp = await FollowUp.findById(followUpId).populate({
            path: 'leadId',
            populate: {
                path: 'client'
            }
        })
        if (!findedFollowUp) return next(createError(400, 'FollowUp not exist'))

        res.status(200).json({ result: findedFollowUp, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const getFollowUps = async (req, res, next) => {
    try {
        const { leadId } = req.params
        const findedFollowUp = await FollowUp.find({ leadId }).populate({
            path: 'leadId',
            populate: {
                path: 'client'
            }
        })

        res.status(200).json({ result: findedFollowUp, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const getEmployeeFollowUps = async (req, res, next) => {
    try {
        const { leadId } = req.params;

        // Find all follow-ups related to the given leadId
        const allFollowUps = await FollowUp.find({ leadId }).populate('leadId');

        const employeeFollowUps = allFollowUps.filter((followUp) => followUp.leadId?.allocatedTo?.findIndex(allocatedTo => allocatedTo.toString() == req.user?._id.toString()) != -1)

        res.status(200).json({ result: employeeFollowUps, message: 'FollowUps retrieved successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getEmployeeFollowUpsStats = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const followUps = await FollowUp.find()
      .populate({
        path: "leadId",
        match: { isArchived: false },
        populate: [
          { path: "client" },
          { path: "property" },
          { path: "allocatedTo" },
        ],
      })
      .exec();

    const employeeFollowUps = followUps.filter((followUp) => {
      const isAllocated = followUp.leadId?.allocatedTo.some(
        (emp) => emp._id.toString() === req.user?._id.toString()
      );
      return isAllocated;
    });

    const latestFollowUpsMap = {};

    for (const followUp of employeeFollowUps) {
      const leadId = followUp.leadId?._id?.toString();
      if (!leadId) continue;

      if (
        !latestFollowUpsMap[leadId] ||
        new Date(followUp.createdAt) > new Date(latestFollowUpsMap[leadId].createdAt)
      ) {
        latestFollowUpsMap[leadId] = followUp;
      }
    }

    const groupedFollowUps = {};

    for (const followUp of Object.values(latestFollowUpsMap)) {
      if (!followUp.followUpDate) continue;

      const followUpDateParsed = new Date(followUp.followUpDate);
      if (followUpDateParsed > currentDate) continue;

      let normalizedDate;
      try {
        normalizedDate = format(
          parse(followUp.followUpDate, "d-M-yy", new Date()),
          "yyyy-MM-dd"
        );
      } catch {
        normalizedDate = format(new Date(followUp.followUpDate), "yyyy-MM-dd");
      }

      if (!groupedFollowUps[normalizedDate]) groupedFollowUps[normalizedDate] = [];
      groupedFollowUps[normalizedDate].push(followUp);
    }

    const responseArray = Object.keys(groupedFollowUps)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => ({
        date,
        followUps: groupedFollowUps[date],
      }));

    res.status(200).json({
      result: responseArray,
      message: "Employee follow-up stats fetched successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching employee follow-up stats:", error);
    next(createError(500, error.message));
  }
};

export const getFollowUpsStats = async (req, res, next) => {
  try {
    const { filter } = req.query; // "today", "all", "month"

    const followUps = await FollowUp.find({ followUpDate: { $ne: null } })
      .populate({
        path: 'leadId',
        match: { isArchived: false },
        select: 'status client property allocatedTo city clientPhone clientName',
        populate: [
          { path: 'client', select: 'firstName lastName' },
          { path: 'property', select: 'title' },
          { path: 'allocatedTo', select: 'firstName lastName' },
        ],
      });

    const validFollowUps = followUps.filter(fu => fu.leadId && fu.followUpDate);

    const latestFollowUpsByLead = {};
    for (const followUp of validFollowUps) {
      const leadId = followUp.leadId._id.toString();
      if (
        !latestFollowUpsByLead[leadId] ||
        new Date(followUp.createdAt) > new Date(latestFollowUpsByLead[leadId].createdAt)
      ) {
        latestFollowUpsByLead[leadId] = followUp;
      }
    }

    let filteredFollowUps = Object.values(latestFollowUpsByLead);

    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (filter === 'today') {
      filteredFollowUps = filteredFollowUps.filter(fu => fu.followUpDate === today);
    } else if (filter === 'month') {
      filteredFollowUps = filteredFollowUps.filter(fu => {
        const date = new Date(fu.followUpDate);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    }

    const groupedByDate = {};
    for (const followUp of filteredFollowUps) {
      const date = followUp.followUpDate;
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(followUp);
    }

    const responseArray = Object.keys(groupedByDate)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({
        date,
        followUps: groupedByDate[date],
      }));

    res.status(200).json({
      result: responseArray,
      message: 'Stats fetched successfully.',
      success: true,
    });
  } catch (error) {
    console.error('Error in getFollowUpsStats:', error);
    next(createError(500, error.message));
  }
};


export const createFollowUp = async (req, res, next) => {
    try {

        const { status, followUpDate, remarks, } = req.body
        if (!status || !followUpDate || !remarks)
            return next(createError(400, 'Make sure to provide all the fields'))

        const newFollowUp = await FollowUp.create(req.body)
        const UpdatedLeadStatus = await Lead.findByIdAndUpdate(newFollowUp.leadId, { status: status }, { new: true })

        res.status(200).json({ result: newFollowUp && UpdatedLeadStatus, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteFollowUp = async (req, res, next) => {
    try {

        const { followUpId } = req.params
        const findedFollowUp = await FollowUp.findById(followUpId)
        if (!findedFollowUp) return next(createError(400, 'FollowUp not exist'))

        const deletedFollowUp = await FollowUp.findByIdAndDelete(followUpId)
        res.status(200).json({ result: deletedFollowUp, message: 'followUp deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteWholeCollection = async (req, res, next) => {
    try {

        const result = await FollowUp.deleteMany()
        res.status(200).json({ result, message: 'FollowUp collection deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}