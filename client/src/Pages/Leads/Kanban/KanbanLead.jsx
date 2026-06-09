import React from "react";
import { Alarm, Archive, LinkOff, LinkOutlined, Message, Person } from "@mui/icons-material";
import { Avatar, Link, Tooltip } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { person1 } from "../../../assets";
import { Check2Square } from "react-bootstrap-icons";
import { updateLead } from "../../../redux/action/lead";
import { format } from "timeago.js";
import { rootURL } from "../../../constant";
import { useDispatch } from "react-redux";
import { PiArchiveBoxLight, PiArchiveLight } from "react-icons/pi";
import { IoOpenOutline } from "react-icons/io5";

const Lead = ({ lead, index }) => {
  const dispatch = useDispatch();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${rootURL}/leads/${lead?._id}`);
  };
  const handleArchive = () => {
    dispatch(updateLead(lead._id, { isArchived: true }, { loading: false }));
  };
  const handleUnArchive = () => {
    dispatch(updateLead(lead._id, { isArchived: false }, { loading: false }));
  };

  return (
    <Draggable draggableId={lead?._id} key={lead?._id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          className={` flex flex-col gap-[8px] bg-white rounded-[4px] p-[6px] ${
            snapshot.isDragging ? "opacity-[80] " : " "
          }  `}>
          <div className="flex flex-col gap-[6px] ">
            <h4 className="text-[13px] text-primary-gray ">{lead?.title}</h4>
            <span className="w-fit text-[10px] text-primary-gray bg-secondary-gray px-[6px] py-[2px] rounded-[2px] ">
              {lead?.contact}
            </span>
            <span className="w-fit text-[10px] text-primary-blue bg-secondary-blue px-[6px] py-[2px] rounded-[2px] ">
              {lead?.value}
            </span>
            <div className="text-[11px] flex flex-col gap-[4px] ">
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Telephone:</span>
                <span className="text-red-400 ">{lead?.clientPhone || "---"}</span>
              </div>
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Created:</span>
                <span className="text-green-400 ">{format(lead?.createdAt) || "---"}</span>
              </div>
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Project:</span>
                <span className="text-blue-400 ">{lead?.property?.title || "---"}</span>
              </div>
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Email:</span>
                <span className="text-yellow-400 ">{lead?.client?.email || "---"}</span>
              </div>
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Priority:</span>
                <span className="text-orange-400 capitalize ">{lead?.priority || "---"}</span>
              </div>
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Source:</span>
                <span className="text-teal-400 ">{lead?.source || "---"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center ">
            <div className="flex justify-start items-center gap-[8px] ">
              <Tooltip arrow placement="bottom" title={lead?.isArchived ? "Un Archive" : "Archive"}>
                {" "}
                {lead?.isArchived ? (
                  <PiArchiveLight
                    onClick={() => handleUnArchive()}
                    className="cursor-pointer text-red-500 text-[23px] hover:text-red-600"
                  />
                ) : (
                  <PiArchiveBoxLight
                    onClick={() => handleArchive()}
                    className="cursor-pointer text-red-500 text-[20px] hover:text-red-600"
                  />
                )}
              </Tooltip>
            </div>

            <Tooltip className="flex items-center gap-3 font-primary" arrow placement="bottom" title={lead?.allocatedTo[0]?.firstName} >
              {lead?.allocatedTo[0]?.username}<Avatar src={lead?.allocatedTo[0]?.firstName} alt={lead?.allocatedTo[0]?.firstName} style={{ width: "2rem", height: "2rem" }} className=" " />
            </Tooltip>
          </div>

          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};

export default Lead;
