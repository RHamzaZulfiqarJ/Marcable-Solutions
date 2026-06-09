import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../redux/action/task";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { CFormSelect } from "@coreui/react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateTask = ({ open, setOpen, openFromNavbar, setOpenFromNavbar }) => {
  ////////////////////////////////////// VARIABLES //////////////////////////////
  const { isFetching, error } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialTaskState = {
    completedTask: "",
    completedTaskDate: "",
    completedTaskStatus: "",
    completedTaskComment: "",
    newTask: "",
    newTaskDeadline: "",
    newTaskComment: "",
  };

  ////////////////////////////////////// STATES ///////////////////////////////////
  const [taskData, setTaskData] = useState(initialTaskState);

  ////////////////////////////////////// USE EFFECTS //////////////////////////////

  ////////////////////////////////////// FUNCTION /////////////////////////////////
  const handleSubmit = (e) => {
    const {
      completedTask,
      completedTaskComment,
      completedTaskDate,
      completedTaskStatus,
      newTask,
      newTaskComment,
      newTaskDeadline,
    } = taskData;
    e.preventDefault();
    if (
      !completedTask ||
      !completedTaskComment ||
      !completedTaskDate ||
      !completedTaskStatus ||
      !newTask ||
      !newTaskComment ||
      !newTaskDeadline
    )
      return alert("Make sure to rovide all the fields");
    dispatch(createTask(taskData, setOpen));
    setTaskData(initialTaskState);
  };

  const handleInputChange = (field, value) => {
    setTaskData((pre) => ({ ...pre, [field]: value }));
  };
  const handleClose = () => {
    setOpen(false);
    setOpenFromNavbar(false);
  };

  const statuses = [
    { name: "New Client", value: "newClient" },
    { name: "Follow Up", value: "followUp" },
    { name: "Contacted Client", value: "contactedClient" },
    { name: "Call Not Attend", value: "callNotAttend" },
    { name: "Visit Schedule", value: "visitSchedule" },
    { name: "Visit Done", value: "visitDone" },
    { name: "Closed (Won)", value: "closedWon" },
    { name: "Closed (Lost)", value: "closedLost" },
  ];

  return (
    <div>
      <Dialog
        open={open || openFromNavbar}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400">Add New Task</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500">
            <div className="text-xl flex justify-start items-center gap-2 font-primary">
              <PiNotepad size={23} />
              <span>Task Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">Task </td>
                <td className="pb-4">
                  <CFormSelect
                    value={taskData.completedTask}
                    onChange={(e) => handleInputChange("completedTask", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer font-primary text-black">
                    <option value="">Select an Option</option>

                    {statuses.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Completed Date </td>
                <td className="pb-4">
                  <TextField
                    type="date"
                    value={taskData.completedTaskDate}
                    onChange={(e) => handleInputChange("completedTaskDate", e.target.value)}
                    size="small"
                    className="font-primary"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Status </td>
                <td className="pb-4">
                  <Select
                    name="status"
                    fullWidth
                    size="small"
                    value={taskData.completedTaskStatus}
                    onChange={(e) => handleInputChange("completedTaskStatus", e.target.value)}>
                    <MenuItem value="successful">Successful</MenuItem>
                    <MenuItem value="unsuccessful">Unsuccessful</MenuItem>
                  </Select>
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Comment </td>
                <td className="pb-4">
                  <TextField
                    multiline
                    rows={5}
                    type="text"
                    value={taskData.completedTaskComment}
                    onChange={(e) => handleInputChange("completedTaskComment", e.target.value)}
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Next Task </td>
                <td className="pb-4">
                  <CFormSelect
                    value={taskData.newTask}
                    onChange={(e) => handleInputChange("newTask", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer font-primary text-black">
                    <option value="">Select an Option</option>

                    {statuses.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Deadline </td>
                <td className="pb-4">
                  <TextField
                    type="date"
                    value={taskData.newTaskDeadline}
                    onChange={(e) => handleInputChange("newTaskDeadline", e.target.value)}
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Comment </td>
                <td className="pb-4">
                  <TextField
                    multiline
                    rows={5}
                    type="text"
                    value={taskData.newTaskComment}
                    onChange={(e) => handleInputChange("newTaskComment", e.target.value)}
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            variant="contained"
            onClick={handleSubmit}
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTask;
