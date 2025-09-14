import React, { useEffect, useState } from 'react'
import Topbar from './Topbar';
import { useDispatch, useSelector } from 'react-redux';
import { CCallout } from '@coreui/react';
import { Table } from '../../../Components';
import { deleteLead, getAcceptedLeads, getPendingLeads, getRejectedLeads, rejectLead } from '../../../redux/action/facebookLeads';
import Countdown from 'react-countdown';
import AcceptLead from './AcceptLead';
import { Tooltip } from '@mui/material';
import { PiTrashLight } from 'react-icons/pi';

const FbLeads = () => {

  ////////////////////////////////////// VARIABLES //////////////////////////////
  const dispatch = useDispatch();
  const { pendingLeads, acceptedLeads, rejectedLeads, isFetching } = useSelector((state) => state.facebookLeads);
  const { loggedUser } = useSelector((state) => state.user);

  const [filter, setFilter] = useState({
    pending: true,
    accepted: false,
    rejected: false,
  });

  let leads = [];
  if (filter.pending) leads = leads.concat(pendingLeads || []);
  if (filter.accepted) leads = leads.concat(acceptedLeads || []);
  if (filter.rejected) leads = leads.concat(rejectedLeads || []);

  const rows = leads.map(event => ({
    _id: event.id._id,
    leadId: event.id?.leadId,
    status: event.status,
    createdTime: event.id?.createdTime,
    eventTitle: event.id?.eventTitle,
    expireAt: event.id?.expireAt,
    field_data: event.id?.field_data,
  }));

  const columns = [
    {
      field: "leadId",
      headerName: "Lead ID",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => <div className="font-primary font-light">{params.row?.leadId}</div>,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerClassName: "super-app-theme--header",
      width: 200,
      renderCell: (params) => {
        const nameField = params.row.field_data.find(field => field.name === 'full_name');
        return <div className="font-primary font-light">{nameField ? nameField.values[0] : 'N/A'}</div>;
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      headerClassName: "super-app-theme--header",
      width: 170,
      renderCell: (params) => {
        const phoneField = params.row.field_data.find(field => field.name === 'phone_number');
        return <div className="font-primary font-light">{phoneField ? phoneField.values[0] : 'N/A'}</div>;
      },
    },
    {
      field: "project",
      headerName: "Project",
      headerClassName: "super-app-theme--header",
      width: 200,
      renderCell: (params) => {
        const projectField = params.row.field_data.find(field => field.name === 'project');
        return <div className="font-primary font-light">{projectField ? projectField.values[0] : 'N/A'}</div>;
      }
    },
    {
      field: "expireAt",
      headerName: "Expires in",
      headerClassName: "super-app-theme--header",
      width: 150,
      
      renderCell: (params) => {
        return (
          <div className="font-primary font-light">
            <Countdown
              date={new Date(new Date(params.row.createdTime).getTime() + 24 * 60 * 60 * 1000)}
              renderer={({ hours, minutes, seconds, completed }) => {
                if (completed) {
                  return <span>Expired</span>;
                } else if (hours > 1) {
                  return <span>{hours} Hours</span>;
                } else if (hours < 1 ) {
                  return <span>{minutes} Minutes</span>;
                } else {
                  return <span>{seconds} Seconds</span>;
                }
              }}
            />
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium
          ${params.row?.status == "accepted" ? "border-green-500 text-green-500" : ""}
          ${params.row?.status == "rejected" ? "border-red-400 text-red-400" : ""} 
          ${params.row?.status == "pending" ? "border-orange-400 text-orange-400" : ""} 
          `}>
          {params.row?.status}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerClassName: 'super-app-theme--header',
      width: 170,
      renderCell: (params) => (
        <div className="flex gap-[10px] items-center transition-all">
          <div className="flex gap-[4px] ">
            {params.row.status.toLowerCase() == "pending" ? (
              <>
                <button
                  onClick={() => handleAcceptLead(params.row?.field_data, params.row?._id)}
                  className="border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium text-[14x] border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300">
                  Approve
                </button>
                <button
                  onClick={() => handleRejectLead(params.row._id)}
                  className="border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium text-[14x] border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300">
                  Reject
                </button>
              </>
            ) : (
              <Tooltip placement="top" title="Delete">
                {" "}
                <PiTrashLight
                  onClick={() => handleDeleteLead(params.row._id)}
                  className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
                />
              </Tooltip>
            )}
          </div>
        </div>
      )
    }
  ]

  ////////////////////////////////////// STATES //////////////////////////////
  const [showSidebar, setShowSidebar] = useState(false);
  const [openAcceptModel, setOpenAcceptModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [userId, setUserId] = useState(loggedUser?._id);
  const [scroll, setScroll] = useState("paper");

  ////////////////////////////////////// USEEFFECTS //////////////////////////////
  useEffect(() => {
    if (filter.pending) dispatch(getPendingLeads(userId));
    if (filter.accepted) dispatch(getAcceptedLeads(userId));
    if (filter.rejected) dispatch(getRejectedLeads(userId));
  }, [filter, userId, dispatch]);

  ////////////////////////////////////// Functions //////////////////////////////
  const handleAcceptLead = (fieldData, leadId) => {
    setOpenAcceptModal(true);
    setScroll("paper");
    setSelectedLead(fieldData);
    setLeadId(leadId);
  };

  const handleRejectLead = (leadId) => {
    dispatch(rejectLead(userId, leadId)).then(() => {
      if (filter.pending) dispatch(getPendingLeads(userId));
      if (filter.accepted) dispatch(getAcceptedLeads(userId));
      if (filter.rejected) dispatch(getRejectedLeads(userId));
    });
  };

  const handleDeleteLead = (leadId) => {
    dispatch(deleteLead(userId, leadId)).then(() => {
      if (filter.pending) dispatch(getPendingLeads(userId));
      if (filter.accepted) dispatch(getAcceptedLeads(userId));
      if (filter.rejected) dispatch(getRejectedLeads(userId));
    });
  };
  
  return (
    <div className='w-full'>
      <Topbar userId={userId} filter={filter} setFilter={setFilter} />
      <CCallout color="primary">
        <Table
          columns={columns}
          rows={rows}
          rowsPerPage={10}
          isFetching={isFetching}
          showSidebar={showSidebar}
        />
      </CCallout>

      <AcceptLead setOpen={setOpenAcceptModal} open={openAcceptModel} scroll={scroll} fieldData={selectedLead} userId={userId} leadId={leadId} />
    </div>
  )
}

export default FbLeads;