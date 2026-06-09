import React, { useEffect, useState } from "react";
import Board from "./Board";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../../../redux/action/lead";
import { CircularProgress } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

const Kanban = ({ options, setOptions }) => {
  /////////////////////////////////////// VARIABLES ////////////////////////////////////////
  const dispatch = useDispatch();
  const { leads, isFetching } = useSelector((state) => state.lead);
  const archivedLeads = leads.filter(lead => lead.isArchived)
  const unarchivedLeads = leads.filter(lead => !lead.isArchived)
  let initialFilteredLeadsState = {
    newClient: [],
    followUp: [],
    contactedClient: [],
    callNotAttend: [],
    visitDone: [],
    visitSchedule: [],
    closedWon: [],
    closedLost: [],
  };

  const statuses = [
    'newClient',
    'followUp',
    'contactedClient',
    'callNotAttend',
    'visitDone',
    'visitSchedule',
    'closedWon',
    'closedLost',
  ]
  /////////////////////////////////////// STATE ////////////////////////////////////////
  let [filteredLeads, setFilteredLeads] = useState(initialFilteredLeadsState);
  const { newClient, followUp, contactedClient, callNotAttend, visitDone, visitSchedule, closedWon, closedLost } = filteredLeads;

  /////////////////////////////////////// USE EFFECT /////////////////////////////////////
  useEffect(() => {
    statuses.forEach(
      (status) =>
      (filteredLeads[status] = (options.showArchivedLeads ? archivedLeads : unarchivedLeads).filter(
        (lead) => lead.status == status
      ))
    );
    setFilteredLeads({ ...filteredLeads });
  }, [unarchivedLeads, archivedLeads]);

  /////////////////////////////////////// FUNCTION ///////////////////////////////////////
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // Determine the source and destination columns
    const sourceColumn = getSourceColumn(result.source.droppableId);
    const destinationColumn = getSourceColumn(result.destination.droppableId);

    // Move the dragged lead from the source to the destination column
    const draggedLead = sourceColumn.leads[result.source.index];
    filteredLeads[sourceColumn.title].splice(result.source.index, 1);
    filteredLeads[destinationColumn.title].splice(result.destination.index, 0, draggedLead);
    setFilteredLeads({ ...filteredLeads });

    // upating lead status in backend/database
    dispatch(updateLead(draggedLead._id, { status: destinationColumn.title }));
  };

  const getSourceColumn = (droppableId) => {
    switch (droppableId) {
      case "1":
        return { leads: newClient, title: "newClient" };
      case "2":
        return { leads: followUp, title: "followUp" };
      case "3":
        return { leads: contactedClient, title: "contactedClient" };
      case "4":
        return { leads: callNotAttend, title: "callNotAttend" };
      case "5":
        return { leads: visitDone, title: "visitDone" };
      case "6":
        return { leads: visitSchedule, title: "visitSchedule" };
      case "7":
        return { leads: closedWon, title: "new" };
      case "8":
        return { leads: closedLost, title: "closedLost" };
      default:
        return closedWon;
    }
  };

  return (
    <div className="w-full h-fit bg-inherit flex flex-col gap-[2rem]  ">
      {isFetching ? (
        <div className="w-full h-[11rem] flex justify-center items-center ">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="gray"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex justify-start gap-[1rem] w-full min-h-[30rem] h-fit pb-[1rem] overflow-x-scroll capitalize">
            <Board leads={newClient} title='new Client' _id='1' />
            <Board leads={followUp} title="follow Up" _id="2" />
            <Board leads={contactedClient} title="contacted Client" _id="3" />
            <Board leads={callNotAttend} title="call Not Attend" _id="4" />
            <Board leads={visitDone} title="visit Done" _id="5" />
            <Board leads={visitSchedule} title="visit Schedule" _id="6" />
            <Board leads={closedWon} title="closed Won" _id="7" />
            <Board leads={closedLost} title="closed Lost" _id="8" />
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default Kanban;