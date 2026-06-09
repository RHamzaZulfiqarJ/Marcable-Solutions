import React, { memo, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import View from "./View";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";
import { getEvents } from "../../../redux/action/event";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event?.events || []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!events.length) dispatch(getEvents());
  }, [dispatch, events.length]);

  const calendarEvents = useMemo(() => {
    return events.map((item) => ({
      ...item,
      start: item.start ? new Date(item.start) : new Date(item.startDate || item.createdAt),
      end: item.end ? new Date(item.end) : new Date(item.endDate || item.createdAt),
      title: item.title || "Event",
    }));
  }, [events]);

  const handleShowViewModal = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  return (
    <div className="relative w-full min-w-0 font-primary">
      <View open={showViewModal} setOpen={setShowViewModal} event={selectedEvent} setOpenUpdateModal={setShowUpdateModal} setOpenDeleteModal={setShowDeleteModal} />
      <Update open={showUpdateModal} setOpen={setShowUpdateModal} event={selectedEvent} />
      <Create open={showCreateModal} setOpen={setShowCreateModal} />
      <Delete open={showDeleteModal} setOpen={setShowDeleteModal} eventId={selectedEvent?._id} />

      <Tooltip title="Add New Event To Calendar" placement="top" arrow>
        <button onClick={() => setShowCreateModal(true)} className="absolute bottom-3 right-3 z-20 rounded-full bg-red-500 p-3 text-white shadow-xl sm:p-4">
          <Add />
        </button>
      </Tooltip>

      <div className="w-full overflow-x-auto">
        <div className="h-[28rem] min-w-[45rem] sm:h-[31rem] sm:min-w-0">
          <Calendar localizer={localizer} events={calendarEvents} onDoubleClickEvent={handleShowViewModal} views={["month", "day", "week"]} style={{ height: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default memo(EventCalendar);
