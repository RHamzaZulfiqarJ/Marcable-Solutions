import React, { useEffect, useState, useMemo } from "react";
import { Table } from "../../../Components";
import Topbar from "./Topbar";
import DeleteModal from "../Refunds/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { getApprovals } from "../../../redux/action/approval";
import Request from "./VoucherRequest";
import EnterPassword from "./EnterPassword";
import { Tooltip } from "@mui/material";
import { PiTrashLight } from "react-icons/pi";

function VoucherApprovals() {
  ////////////////////////////////////// VARIABLES //////////////////////////////
  const dispatch = useDispatch();
  const { voucherApprovals, isFetching, error } = useSelector((state) => state.approval);
  const columns = [
    {
      field: "uid",
      headerName: "ID",
      width: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <span className="font-primary capitalize">{params.row?.uid}</span>,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 140,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="capitalize font-primary">
          <p>{params.row?.data?.clientName}</p>
        </div>
      ),
    },
    {
      field: "project",
      headerName: "Project",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="font-primary">{params.row?.data?.project?.title}</div>
      ),
    },
    {
      field: "Created By",
      headerName: "Created By",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-primary">{params.row?.data?.allocatedTo?.firstName} {params.row?.data?.allocatedTo?.lastName}</div>,
    },
    {
      field: "issuingDate",
      headerName: "Issue Date",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-primary">{params.row?.data?.issuingDate}</div>,
    },
    {
      field: "type",
      headerName: "Payment Type",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="font-primary capitalize">
          {params.row?.data?.type == "cheque"
            ? `${params.row?.data?.type} (${params.row?.data?.cheque})`
            : params.row?.data?.type}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize  font-primary font-medium
          ${params.row?.status == "accepted" ? "border-green-500 text-green-500" : ""}
          ${params.row?.status == "rejected" ? "border-red-400 text-red-400" : ""} 
          ${params.row?.status == "underProcess" ? "border-yellow-400 text-yellow-400" : ""} 
          `}>
          {params.row?.status}
        </span>
      ),
    },
    {
      field: "paid",
      headerName: "Amount Paid",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className={`font-primary`}>{params.row?.data?.paid}</div>,
    },
    {
      field: "approve/reject",
      headerName: "Approve/Reject",
      headerClassName: "super-app-theme--header",
      width: 170,
      renderCell: (params) => (
        <div className="flex gap-[4px] ">
          {params.row.status.toLowerCase() == "underprocess" ? (
            <>
              <button
                onClick={() => {
                  setSelectedApproval(params.row);
                  setOpenEnterPassword(true);
                  setRefundType("approve");
                }}
                className="border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium text-[14x] border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300">
                Approve
              </button>
              <button
                onClick={() => {
                  setSelectedApproval(params.row);
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
                  setSelectedApproval(params.row);
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
  const [view, setView] = useState("table");
  const [openRequest, setOpenRequest] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState("");
  const [openEnterPassword, setOpenEnterPassword] = useState(false);
  const [refundType, setRefundType] = useState(""); // approve/reject
  const [search, setSearch] = useState("")

  ////////////////////////////////////// USE EFFECTS //////////////////////////////
  useEffect(() => {
    dispatch(getApprovals("voucher"));
  }, []);

  ////////////////////////////////////// FUNCTION ////////////////////////////////

  const filteredRequests = useMemo(() => {
    return voucherApprovals.filter(voucher =>
      voucher?.data?.allocatedTo?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      voucher?.data?.allocatedTo?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      voucher?.status.toLowerCase().includes(search.toLowerCase()) ||
      voucher?.data?.project?.title.toLowerCase().includes(search.toLowerCase()) ||
      voucher?.data?.clientName.toLowerCase().includes(search.toLowerCase()) ||
      voucher?.uid.toLowerCase().includes(search.toLowerCase())
    );
  }, [voucherApprovals, search]);

  return (
    <div className="w-full h-fit bg-inherit flex flex-col font-primary">
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        approvalId={selectedApproval._id}
      />
      <EnterPassword
        open={openEnterPassword}
        setOpen={setOpenEnterPassword}
        approval={selectedApproval}
        type={refundType}
      />
      <Request open={openRequest} setOpen={setOpenRequest} />

      <Topbar view={view} setView={setView} isFiltered={isFiltered} setIsFiltered={setIsFiltered} search={search} setSearch={setSearch} />
      <Table
        rows={filteredRequests}
        columns={columns}
        rowsPerPage={10}
        isFetching={isFetching}
        error={error}
      />
    </div>
  );
}

export default VoucherApprovals;