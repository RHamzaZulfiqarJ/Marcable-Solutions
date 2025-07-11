import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowUpsStats, getEmployeeFollowUpsStats } from "../../../redux/action/followUp";
import Lead from "../Lead";
import moment from "moment";
import { Table } from "../../../Components";
import { Tooltip } from "@mui/material";
import { IoOpenOutline } from "react-icons/io5";
import { getLeadReducer } from "../../../redux/reducer/lead";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../utils";

const AllFollowUpsTable = () => {
  /////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch();
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { followUpsStats, isFetching } = useSelector((state) => state.followUp);
  const { loggedUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  /////////////////////////////////////////////////// STATES ////////////////////////////////////////////////
  const [showLead, setShowLead] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(false);

  /////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////
  useEffect(() => {
    loggedUser.role == "employee"
      ? dispatch(getEmployeeFollowUpsStats())
      : dispatch(getFollowUpsStats());
  }, []);

  /////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////
  const createData = (date, day, followUps = []) => {
    return {
      date,
      day,
      totalFollowUps: followUps.length,
      followUps,
    };
  };

  const rows = followUpsStats?.map((stat) => {
    const dateParts = stat.date.split("/");
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[0]);
    const date = new Date(year, month, day);

    return createData(stat.date, DAYS[date.getDay()], stat.followUps);
  });

  const sortedRow = rows.reverse();

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 70,
      renderCell: (params) => <div className="font-primary font-light">{params.row.uid}</div>,
    },
    {
      field: "leadId?.allocatedTo",
      headerName: "Staff",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row?.leadId?.allocatedTo?.length > 1
            ? params.row?.leadId?.allocatedTo?.map((item, key) => (
                <Tooltip
                  className="capitalize flex gap-2 font-primary font-light"
                  key={key}
                  title={`• ${item?.firstName}`}
                  arrow>
                  • {item?.firstName}
                </Tooltip>
              ))
            : params.row?.leadId?.allocatedTo?.map((item, key) => (
                <Tooltip
                  className="capitalize flex gap-2 font-primary font-light"
                  key={key}
                  title={item?.firstName}
                  arrow>
                  {item?.firstName}
                </Tooltip>
              ))}
        </>
      ),
    },
    {
      field: "leadId?.property",
      headerName: "Project",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <Tooltip title={params.row?.leadId?.property?.title} arrow placement="bottom">
          <div className="font-primary font-light capitalize">
            {params.row?.leadId?.property?.title}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.city",
      headerName: "City",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.city} arrow placement="bottom">
          <div className="font-primary font-light capitalize">{params.row.leadId?.city}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.clientPhone",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      width: 110,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.clientPhone} arrow placement="bottom">
          <div className="font-primary font-light capitalize">{params.row.leadId?.clientPhone}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.clientName",
      headerName: "Client Name",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.clientName} arrow placement="bottom">
          <div className="font-primary font-light capitalize">{params.row.leadId?.clientName}</div>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Current Status",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <Tooltip
          title={params.row.status ? params.row.status : params.row?.leadId?.status}
          arrow
          placement="bottom">
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
        </Tooltip>
      ),
    },
    {
      field: "followUpDate",
      headerName: "Next Follow Up",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.followUpDate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      field: "createdat",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.createdAt).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <div>
          <Tooltip arrow placement="bottom" title="View">
            <div
              className="cursor-pointer"
              onClick={() => handleOpenViewModal(params.row?.leadId?._id)}>
              <IoOpenOutline className="cursor-pointer text-orange-500 text-[23px] hover:text-orange-400" />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleOpenViewModal = (leadId) => {
    dispatch(getLeadReducer(leadId));
    navigate(`/leads/${leadId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {isFetching ? (
        <div className="w-full h-[11rem] flex justify-center items-center ">
          <Loader />
        </div>
      ) : (
        <>
          {sortedRow.map((row) => (
            <div className="flex flex-col gap-2 ">
              <h2 className="text-primary-red text-[24px] capitalize font-light">
                {row.date} {row.day}
              </h2>
              <Table rows={row.followUps} columns={columns} rowsPerPage={10} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllFollowUpsTable;
