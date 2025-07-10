import React from "react";
import Topbar from "./Topbar";
import { Table } from "../../../Components";
import { getFollowUps, getEmployeeFollowUps } from "../../../redux/action/followUp";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";

const FollowUps = () => {
  /////////////////////////////////////////// VARIABLES ////////////////////////////////////////////
  const { followUps, isFetching } = useSelector((state) => state.followUp);
  const { loggedUser } = useSelector((state) => state.user);
  const { leadId } = useParams();
  const dispatch = useDispatch();

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => <div className="font-primary font-light">{params.row.uid}</div>,
    },
    {
      field: "status",
      headerName: "Current Status",
      headerClassName: "super-app-theme--header",
      width: 200,
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium 
          ${params.row?.status == "closedWon" ? "border-green-500 text-green-500" :
            params.row?.status == "closedLost" ? "border-red-400 text-red-400" : 
            params.row?.status == "followUp" ? "border-sky-400 text-sky-400" : 
            params.row?.status == "contactedClient" ? "border-orange-400 text-orange-400" : 
            params.row?.status == "callNotAttend" ? "border-lime-400 text-lime-500" : 
            params.row?.status == "visitSchedule" ? "border-teal-400 text-teal-500" : 
            params.row?.status == "visitDone" ? "border-indigo-400 text-indigo-500" : 
            params.row?.status == "newClient" ? "border-rose-700 text-rose-700" : "border-gray-700 text-gray-700"}`}>
          <span>
            {params.row?.status == "closedWon" ? <div>Closed Won</div> : 
            params.row?.status == "closedLost" ? <div>Closed Lost</div> : 
            params.row?.status == "followUp" ? <div>Follow Up</div> : 
            params.row?.status == "contactedClient" ? <div>Contacted Client</div> : 
            params.row?.status == "callNotAttend" ? <div>Call Not Attend</div> : 
            params.row?.status == "visitSchedule" ? <div>Visit Schedule</div> : 
            params.row?.status == "visitDone" ? <div>Visit Done</div> : 
            params.row?.status == "newClient" ? <div>New Client</div> : <div>{params.row?.status}</div>}
          </span>
        </span>
      ),
    },
    {
      field: "followUpDate",
      headerName: "Next Follow Up Date",
      headerClassName: "super-app-theme--header",
      width: 200,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.followUpDate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerClassName: "super-app-theme--header",
      width: 400,
      renderCell: (params) => <div className="font-primary font-light">{params.row.remarks}</div>,
    },
    {
      field: "createdat",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 180,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.createdAt).format("DD-MM-YYYY")}
        </div>
      ),
    },
  ];

  /////////////////////////////////////////// STATES ////////////////////////////////////////////

  /////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    loggedUser.role == "employee"
      ? dispatch(getEmployeeFollowUps(leadId))
      : dispatch(getFollowUps(leadId));
  }, []);

  /////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////

  return (
    <div className="w-full h-fit bg-inherit flex flex-col">
      <Topbar />
      <Table rows={followUps} isFetching={isFetching} columns={columns} rowsPerPage={10} />
    </div>
  );
};

export default FollowUps;
