import React, { useEffect, useMemo, useState } from "react";
import { Table } from "../../Components";
import Topbar from "./Topbar";
import Task from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTask } from "../../redux/action/task";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { getTaskReducer, getTasksReducer } from "../../redux/reducer/task";
import { PiArchiveBoxLight, PiArchiveLight, PiArchiveThin, PiDotsThreeOutlineThin, PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { format } from "timeago.js";
import { Dropdown, Menu, MenuButton, MenuItem, menuItemClasses } from "@mui/base";
import { IoOpenOutline } from "react-icons/io5";
import { Tooltip, styled } from "@mui/material";
import UpateStatusModal from "./UpdateStatus";
import Kanban from "./Kanban/Kanban";
import Filter from "./Filter";

const blue = {
  100: "#DAECFF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledListbox = styled("ul")(
  ({ theme }) => `
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      transition:all;
      padding: 10px;
      margin: 12px 0;
      width: auto;
      border-radius: 12px;
      overflow: auto;
      outline: 0px;
      background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
      border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      box-shadow: 0px 4px 30px ${theme.palette.mode === "dark" ? grey[900] : grey[200]};
      z-index: 1;
      `
);

const StyledMenuItem = styled(MenuItem)(
  ({ theme }) => `
      list-style: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      &:last-of-type {
        border-bottom: none;
      }
    
      &.${menuItemClasses.focusVisible} {
        outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
        background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
        color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      }
    
      &.${menuItemClasses.disabled} {
        color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
      }
    
      &:hover:not(.${menuItemClasses.disabled}) {
        background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
        color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      }
      `
);

function Tasks() {
  ////////////////////////////////////// VARIABLES //////////////////////////////
  const dispatch = useDispatch();
  const { tasks, allTasks, isFetching, error } = useSelector((state) => state.task);
  const archivedTasks = tasks.filter((task) => task.isArchived);
  const unarchivedTasks = tasks.filter((task) => !task.isArchived);
  const columns = [
    {
      field: "uid",
      headerName: "ID",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip title={""}>
          <span className="font-primary capitalize">{params.row.uid}</span>
        </Tooltip>
      ),
    },
    {
      field: "task",
      headerName: "Task",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium 
          ${params.row?.completedTask == "closedWon" ? "border-green-500 text-green-500" : ""} 
          ${params.row?.completedTask == "closedLost" ? "border-red-400 text-red-400" : ""} 
          ${params.row?.completedTask == "followUp" ? "border-sky-400 text-sky-400" : ""}
          ${params.row?.completedTask == "contactedClient" ? "border-orange-400 text-orange-400" : ""} 
          ${params.row?.completedTask == "callNotAttend" ? "border-lime-400 text-lime-500" : ""} 
          ${params.row?.completedTask == "visitSchedule" ? "border-teal-400 text-teal-500" : ""} 
          ${params.row?.completedTask == "visitDone" ? "border-indigo-400 text-indigo-500" : ""}
          ${params.row?.completedTask == "newClient" ? "border-rose-700 text-rose-700" : ""}`}>
          <span>
            {params.row?.completedTask == "closedWon" ? <div>Closed Won</div> : <div></div>}
            {params.row?.completedTask == "closedLost" ? <div>Closed Lost</div> : <div></div>}
            {params.row?.completedTask == "followUp" ? <div>Follow Up</div> : <div></div>}
            {params.row?.completedTask == "contactedClient" ? <div>Contacted Client</div> : <div></div>}
            {params.row?.completedTask == "callNotAttend" ? <div>Call Not Attend</div> : <div></div>}
            {params.row?.completedTask == "visitSchedule" ? <div>Visit Schedule</div> : <div></div>}
            {params.row?.completedTask == "visitDone" ? <div>Visit Done</div> : <div></div>}
            {params.row?.completedTask == "newClient" ? <div>New Client</div> : <div></div>}
          </span>
        </span>
      ),
    },
    {
      field: "completedTaskDate",
      headerName: "Date of Completion",
      width: 220,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow title="">
          <div className="capitalize font-primary">{format(params.row.completedTaskDate)}</div>
        </Tooltip>
      ),
    },
    {
      field: "completedTaskStatus",
      headerName: "Status",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize  font-primary font-medium
          ${params.row.completedTaskStatus == "successful" ? "border-green-500 text-green-500" : ""}
          ${params.row.completedTaskStatus == "unsuccessful" ? "border-red-400 text-red-400" : ""} 
          `}>
          {params.row.completedTaskStatus}
        </span>
      ),
    },
    {
      field: "newTask",
      headerName: "New Task",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium 
          ${params.row?.newTask == "closedWon" ? "border-green-500 text-green-500" : ""} 
          ${params.row?.newTask == "closedLost" ? "border-red-400 text-red-400" : ""} 
          ${params.row?.newTask == "followUp" ? "border-sky-400 text-sky-400" : ""}
          ${params.row?.newTask == "contactedClient" ? "border-orange-400 text-orange-400" : ""} 
          ${params.row?.newTask == "callNotAttend" ? "border-lime-400 text-lime-500" : ""} 
          ${params.row?.newTask == "visitSchedule" ? "border-teal-400 text-teal-500" : ""} 
          ${params.row?.newTask == "visitDone" ? "border-indigo-400 text-indigo-500" : ""}
          ${params.row?.newTask == "newClient" ? "border-rose-700 text-rose-700" : ""}`}>
          <span>
            {params.row?.newTask == "closedWon" ? <div>Closed Won</div> : <div></div>}
            {params.row?.newTask == "closedLost" ? <div>Closed Lost</div> : <div></div>}
            {params.row?.newTask == "followUp" ? <div>Follow Up</div> : <div></div>}
            {params.row?.newTask == "contactedClient" ? <div>Contacted Client</div> : <div></div>}
            {params.row?.newTask == "callNotAttend" ? <div>Call Not Attend</div> : <div></div>}
            {params.row?.newTask == "visitSchedule" ? <div>Visit Schedule</div> : <div></div>}
            {params.row?.newTask == "visitDone" ? <div>Visit Done</div> : <div></div>}
            {params.row?.newTask == "newClient" ? <div>New Client</div> : <div></div>}
          </span>
        </span>
      ),
    },
    {
      field: "newTaskDeadline",
      headerName: "Deadline",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="font-primary">{format(params.row.newTaskDeadline)}</div>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="flex gap-[10px] ">
          <Tooltip placement="top" title="Delete">
            {" "}
            <PiTrashLight
              onClick={() => handleOpenDeleteModal(params.row._id)}
              className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
            />
          </Tooltip>
          <Tooltip placement="top" title="View">
            {" "}
            <IoOpenOutline
              onClick={() => handleClickOpen(params.row)}
              className="cursor-pointer text-orange-500 text-[23px] hover:text-orange-400"
            />
          </Tooltip>
          <Tooltip placement="top" title="Edit">
            {" "}
            <CiEdit
              onClick={() => handleOpenEditModal(params.row)}
              className="cursor-pointer text-green-500 text-[23px] hover:text-green-600"
            />
          </Tooltip>
          <Tooltip arrow placement="top" title={params.row.isArchived ? "Un Archive" : "Archive"}>
            {" "}
            {
              params.row?.isArchived
                ?
                <PiArchiveLight onClick={() => handleUnArchive(params.row)} className="cursor-pointer text-amber-500 text-[23px] hover:text-amber-600" />
                :
                <PiArchiveBoxLight onClick={() => handleArchive(params.row)} className="cursor-pointer text-amber-500 text-[23px] hover:text-amber-600" />
            }
          </Tooltip>
        </div>
      ),
    },
  ];

  ////////////////////////////////////// STATES //////////////////////////////
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [options, setOptions] = useState({
    isKanbanView: false,
    showEmployeeTasks: false,
    showArchivedTasks: false,
  });

  ////////////////////////////////////// USE EFFECTS //////////////////////////////
  useEffect(() => {
    dispatch(getTasks());
  }, []);

  useEffect(() => {
    if (!isFiltered) {
      dispatch(getTasksReducer(allTasks));
    }
  }, [isFiltered]);

  ////////////////////////////////////// FUNCTION //////////////////////////////
  const handleArchive = (task) => {
    dispatch(updateTask(task._id, { isArchived: true }, { loading: false })).then(() =>
      dispatch(getTasks())
    );
  };
  const handleUnArchive = (task) => {
    dispatch(updateTask(task._id, { isArchived: false }, { loading: false })).then(() =>
      dispatch(getTasks())
    );
  };
  const handleClickOpen = (task) => {
    dispatch(getTaskReducer(task));
    setOpenTask(true);
  };
  const handleOpenEditModal = (task) => {
    dispatch(getTaskReducer(task));
    setOpenEditModal(true);
  };
  const handleOpenDeleteModal = (taskId) => {
    setSelectedTaskId(taskId);
    setOpenDeleteModal(true);
  };
  
  return (
    <div className="w-full h-fit bg-inherit flex flex-col">
      <EditModal open={openEditModal} setOpen={setOpenEditModal} />
      <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} taskId={selectedTaskId} />
      <Task open={openTask} setOpen={setOpenTask} />
      <UpateStatusModal open={openStatusModal} setOpen={setOpenStatusModal} />
      <Filter
        open={openFilters}
        setOpen={setOpenFilters}
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
      />

      <Topbar
        options={options}
        setOptions={setOptions}
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
      />

      {options.isKanbanView ? (
        <Kanban options={options} setOptions={setOptions} />
      ) : (
        <Table
          rows={options.showArchivedTasks ? archivedTasks : unarchivedTasks}
          columns={columns}
          rowsPerPage={10}
          isFetching={isFetching}
          error={error}
        />
      )}
    </div>
  );
}

export default Tasks;
