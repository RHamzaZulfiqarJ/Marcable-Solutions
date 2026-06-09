import React from "react";
import { Alarm, Archive, LinkOff, LinkOutlined, Message, Person } from "@mui/icons-material";
import { Avatar, Link, Tooltip } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { person1 } from "../../../assets";
import { Check2Square } from "react-bootstrap-icons";
import { getTasks, updateTask } from "../../../redux/action/task";
import { format } from "timeago.js";
import { rootURL } from "../../../constant";
import { useDispatch } from "react-redux";
import { PiArchiveBoxLight, PiArchiveLight } from "react-icons/pi";

const Task = ({ task, index }) => {
  const dispatch = useDispatch();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${rootURL}/tasks/${task?._id}`);
  };
  const handleArchive = () => {
    dispatch(updateTask(task._id, { isArchived: true }, { loading: false }));
  };
  const handleUnArchive = () => {
    dispatch(updateTask(task._id, { isArchived: false }, { loading: false }))
    ,then(dispatch(getTasks()));
  };

  return (
    <Draggable draggableId={task?._id} key={task?._id} index={index}>
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
            <h4 className="text-[13px] text-primary-gray ">{task?.title}</h4>
            <div className="text-[11px] flex flex-col gap-[4px] ">
              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Old Task:</span>
                <span
                  className={`capitalize font-primary font-medium 
                    ${task?.completedTask == "closedWon" ? "text-green-500" : ""} 
                    ${task?.completedTask == "closedLost" ? "text-red-400" : ""} 
                    ${task?.completedTask == "followUp" ? "text-sky-400" : ""}
                    ${task?.completedTask == "contactedClient" ? "text-orange-400" : ""} 
                    ${task?.completedTask == "callNotAttend" ? "text-lime-500" : ""} 
                    ${task?.completedTask == "visitSchedule" ? "text-teal-500" : ""} 
                    ${task?.completedTask == "visitDone" ? "text-indigo-500" : ""}
                    ${task?.completedTask == "newClient" ? "text-rose-700" : ""}`}>
                  <span>
                    {task?.completedTask == "closedWon" ? <div>Closed Won</div> : <div></div>}
                    {task?.completedTask == "closedLost" ? <div>Closed Lost</div> : <div></div>}
                    {task?.completedTask == "followUp" ? <div>Follow Up</div> : <div></div>}
                    {task?.completedTask == "ContactedClient" ? (
                      <div>Contacted Client</div>
                    ) : (
                      <div></div>
                    )}
                    {task?.completedTask == "callNotAttend" ? (
                      <div>Call Not Attend</div>
                    ) : (
                      <div></div>
                    )}
                    {task?.completedTask == "visitSchedule" ? (
                      <div>Visit Schedule</div>
                    ) : (
                      <div></div>
                    )}
                    {task?.completedTask == "visitDone" ? <div>Visit Done</div> : <div></div>}
                    {task?.completedTask == "newClient" ? <div>New Client</div> : <div></div>}
                  </span>
                </span>
              </div>

              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Completed:</span>
                <span className="text-gray-400 ">{format(task?.createdAt) || "---"}</span>
              </div>

              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Next Task:</span>
                <span
                  className={`capitalize font-primary font-medium 
                    ${task?.newTask == "closedWon" ? "text-green-500" : ""} 
                    ${task?.newTask == "closedLost" ? "text-red-400" : ""} 
                    ${task?.newTask == "followUp" ? "text-sky-400" : ""}
                    ${task?.newTask == "contactedClient" ? "text-orange-400" : ""} 
                    ${task?.newTask == "callNotAttend" ? "text-lime-500" : ""} 
                    ${task?.newTask == "visitSchedule" ? "text-teal-500" : ""} 
                    ${task?.newTask == "visitDone" ? "text-indigo-500" : ""}
                    ${task?.newTask == "newClient" ? "text-rose-700" : ""}`}>
                  <span>
                    {task?.newTask == "closedWon" ? <div>Closed Won</div> : <div></div>}
                    {task?.newTask == "closedLost" ? <div>Closed Lost</div> : <div></div>}
                    {task?.newTask == "followUp" ? <div>Follow Up</div> : <div></div>}
                    {task?.newTask == "ContactedClient" ? <div>Contacted Client</div> : <div></div>}
                    {task?.newTask == "callNotAttend" ? <div>Call Not Attend</div> : <div></div>}
                    {task?.newTask == "visitSchedule" ? <div>Visit Schedule</div> : <div></div>}
                    {task?.newTask == "visitDone" ? <div>Visit Done</div> : <div></div>}
                    {task?.newTask == "newClient" ? <div>New Client</div> : <div></div>}
                  </span>
                </span>
              </div>

              <div className="flex justify-start items-center gap-[8px]  ">
                <span className="text-primary-gray ">Due Date:</span>
                <span className="text-gray-400 ">{task?.newTaskDeadline || "---"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-[8px] ">
            <Tooltip arrow placement="top" title={task?.isArchived ? "Un Archive" : "Archive"}>
              {" "}
              {task?.isArchived ? (
                <PiArchiveLight
                  onClick={() => handleUnArchive(task)}
                  className="cursor-pointer text-amber-500 text-[23px] hover:text-amber-600"
                />
              ) : (
                <PiArchiveBoxLight
                  onClick={() => handleArchive(task)}
                  className="cursor-pointer text-amber-500 text-[23px] hover:text-amber-600"
                />
              )}
            </Tooltip>
          </div>

          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
