import React from "react";
import KanbanLead from "./KanbanLead";
import { Add } from "@mui/icons-material";
import { Droppable } from "react-beautiful-dnd";

const Board = ({ leads, title, _id }) => {

  return (
    <div
      className={`bg-[#ebf2f5] border-t-[2px]
        ${title == "closed Won" ? "border-t-green-500" : ""} 
        ${title == "closed Lost" ? "border-t-red-400" : ""} 
        ${title == "follow Up" ? "border-t-sky-400 " : ""}
        ${
          title == "contacted Client" ? "border-t-orange-400" : ""
        }
        ${title == "call Not Attend" ? "border-t-lime-400" : ""} 
        ${title == "visit Schedule" ? "border-t-teal-400" : ""} 
        ${title == "visit Done" ? "border-t-indigo-400" : ""}
        ${title == "new Client" ? "border-t-rose-700" : ""}
       rounded-[10px] min-w-[260px] -[270px] h-[700px]`}
    >
      <div className="flex justify-between items-center h-[32px] px-[4px] ">
        <h4 className="text-[16px] text-primary-gray ">{title}</h4>
      </div>

      <div style={{ height: "calc(100% - 32px)" }} className="leadBoard h-full overflow-y-scroll  ">
        <Droppable droppableId={_id} className="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`relative flex-1 flex flex-col gap-[1rem] p-[12px] h-full ${snapshot.isDraggingOver ? "bg-gray-300" : ""}`}
            >
              {leads.map((lead, index) => (
                <React.Fragment key={index}>
                  <KanbanLead key={lead._id} lead={lead} index={index} />
                  {snapshot.draggingOverWith == lead._id && (
                    <div className="custom-placeholder">{provided.placeholder}</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Board;
