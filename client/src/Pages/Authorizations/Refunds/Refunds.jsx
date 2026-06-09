import React, { useEffect, useState } from "react";
import { Table } from "../../../Components";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import { deleteApproval } from "../../../redux/action/approval";
import { getApprovalReducer } from "../../../redux/reducer/approval";
import { rejectRefundApproval } from "../../../redux/action/approval";
import { createCashbook } from "../../../redux/action/cashbook";
import { register } from "../../../redux/action/user";
import { format } from "timeago.js";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import EnterPassword from "./EnterPassword";
import { getRefunds } from "../../../redux/action/refund";
import { getRefundsReducer } from "../../../redux/reducer/refund";
import { PiTrashLight } from "react-icons/pi";
import DeleteModal from "./DeleteModal";

function RefundApprovals() {
  ////////////////////////////////////// VARIABLES //////////////////////////////
  const dispatch = useDispatch();
  const { refunds, allRefunds, isFetching, error } = useSelector((state) => state.refund);
  const { error: cashbookError, isFetching: cashbookIsFetching } = useSelector(
    (state) => state.cashbook
  );
  const columns = [
    {
      field: "uid",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 80,
      renderCell: (params) => <div className="font-primary font-light">{params.row.uid}</div>,
    },
    {
      field: "createdAt",
      headerName: "Issuing Date",
      headerClassName: "super-app-theme--header",
      width: 140,
      renderCell: (params) => (
        <div className="font-primary font-light">{format(params.row.createdAt)}</div>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      headerClassName: "super-app-theme--header",
      width: 140,
      renderCell: (params) => <div className="font-primary font-light">{params.row.amount}</div>,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerClassName: "super-app-theme--header",
      width: 160,
      renderCell: (params) => (
        <div className="font-primary font-light">{params.row.clientName}</div>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      headerClassName: "super-app-theme--header",
      width: 160,
      renderCell: (params) => <div className="font-primary font-light">{params.row.branch}</div>,
    },
    {
      field: "CNIC",
      headerName: "CNIC",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => <div className="font-primary font-light">{params.row.CNIC}</div>,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => <div className="font-primary font-light">{params.row.phone}</div>,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <div
          className={`font-primary font-light border-[1px] p-2 rounded-[3rem]
      ${params.row.status == "accepted" && "border-green-400 text-green-400"}
      ${params.row.status == "rejected" && "border-red-400 text-red-400"}
      ${params.row.status == "underProcess" && "border-amber-400 text-amber-400"}
      `}>
          {params.row.status}
        </div>
      ),
    },
    {
      field: "reason",
      headerName: "Reason",
      headerClassName: "super-app-theme--header",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.row.reason}>
          <div className="font-primary font-light">{params.row.reason}</div>
        </Tooltip>
      ),
    },
    {
      field: "approve/reject",
      headerName: "Approve/Reject",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-[4px] ">
          {params.row.status.toLowerCase() == "underprocess" ? (
            <>
              <button
            onClick={() => {
              setSelectedRefund(params.row);
              setOpenEnterPassword(true);
              setRefundType("approve");
            }}
            className="border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium text-[14x] border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300">
            Approve
          </button>
          <button
            onClick={() => {
              setSelectedRefund(params.row);
              setOpenEnterPassword(true);
              setRefundType("reject");
            }}
            className="border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium text-[14x] border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300">
            Reject
          </button>
            </>
          ) : (
            <Tooltip placement="top" title="Delete">
              {" "}
              <PiTrashLight
                onClick={() => {
                  setOpenDeleteModal(true);
                  setSelectedApproval(params.row?._id);
                }}
                className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
              />
            </Tooltip>
          )}
          
        </div>
      ),
    },
  ];

  ////////////////////////////////////// STATES //////////////////////////////
  const [selectedRefund, setSelectedRefund] = useState("");
  const [openEnterPassword, setOpenEnterPassword] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState("");
  const [refundType, setRefundType] = useState(""); // approve/reject
  const [isFiltered, setIsFiltered] = useState(false);
  const [search, setSearch] = useState("");

  ////////////////////////////////////// USE EFFECTS //////////////////////////////
  useEffect(() => {
    dispatch(getRefunds());
  }, []);

  useEffect(() => {
  if (!openDeleteModal) {
    dispatch(getRefunds());
  }
  }, [openDeleteModal]);

  ////////////////////////////////////// FUNCTION //////////////////////////////


  return (
    <div className="w-full h-fit bg-inherit flex flex-col font-primary">
      <EnterPassword
        open={openEnterPassword}
        setOpen={setOpenEnterPassword}
        refund={selectedRefund}
        type={refundType}
      />

      <Topbar
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        search={search}
        setSearch={setSearch}
      />
      <DeleteModal 
        open={openDeleteModal} 
        setOpen={setOpenDeleteModal} 
        approvalId={selectedApproval}
       />
      <Table
        rows={refunds}
        columns={columns}
        rowsPerPage={10}
        isFetching={isFetching || cashbookIsFetching}
        error={error || cashbookError}
      />
    </div>
  );
}

export default RefundApprovals;
