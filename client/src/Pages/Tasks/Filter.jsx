import React, { useState, useEffect } from "react";
import { Drawer, Button, TextField, Autocomplete, MenuItem, Select } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { filterTask } from "../../redux/action/task";
import { FiFilter } from "react-icons/fi";
import { PiFunnelLight, PiXLight } from "react-icons/pi";
import { pakistanCities } from "../../constant";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { filterTaskReducer } from "../../redux/reducer/task";
import { CFormSelect } from "@coreui/react";

const FilterDrawer = ({ open, setOpen, setIsFiltered }) => {
  ///////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
  const initialFilterState = {
    completedTask: "",
    startingCompletedTaskDate: "",
    endingCompletedTaskDate: "",
    completedTaskStatus: "",
    newTask: "",
    startingNewTaskDeadline: "",
    endingNewTaskDeadline: "",
  };

  ///////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [filters, setFilters] = useState(initialFilterState);

  ///////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleChange = (field, value) => {
    setFilters((pre) => ({ ...pre, [field]: value }));
  };

  const handleFilter = () => {
    dispatch(filterTaskReducer(filters));
    setIsFiltered(true);
    setFilters(initialFilterState);
    setOpen(false);
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
  const TaskStatus = [
    { title: "Successfull", value: "successfull" },
    { title: "Unsuccessfull", value: "unsuccessfull" },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div style={{ minWidth: "50vh", maxWidth: "60vh" }}>
        <div className="flex justify-between items-center h-[10vh] bg-[#20aee3] p-5 text-white font-thin">
          <div className="flex items-center text-[25px] gap-2">
            <PiFunnelLight className="text-[25px]" />
            Filter Items
          </div>
          <div className="cursor-pointer" onClick={() => setOpen(false)}>
            <PiXLight className="text-[25px]" />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {/* Completed Task */}
          <div className="flex flex-col">
            <div>Completed Task : </div>
            <CFormSelect
              value={filters.completedTask}
              onChange={(e) => handleChange("completedTask", e.target.value)}
              className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer font-primary text-black">
              <option value="">Select an Option</option>

              {statuses.map((item, key) => (
                <option key={key} value={item.value}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* Completed Task State */}
          <div className="flex flex-col">
            <div>Completed Task Status : </div>
            <Select
              name="status"
              fullWidth
              size="small"
              value={filters.completedTaskStatus}
              onChange={(e) => handleChange("completedTaskStatus", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="successful">Suchacessful</MenuItem>
              <MenuItem value="unsuccessful">Unsuccessful</MenuItem>
            </Select>
          </div>

          {/* Completed Task Date */}
          <div className="flex flex-col">
            <div>Completed Task Date : </div>
            <div className="flex gap-3">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      slotProps={{ textField: { size: "small", maxWidth: 200 } }}
                      onChange={(date) => handleChange("startingCompletedTaskDate", date.$d)}
                      label="From"
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      className="w-3/6"
                      onChange={(date) => handleChange("endingCompletedTaskDate", date.$d)}
                      label="To"
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>

          {/* new task */}
          <div className="flex flex-col">
            <div>New Task : </div>
            <CFormSelect
              value={filters.newTask}
              onChange={(e) => handleChange("newTask", e.target.value)}
              className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer font-primary text-black">
              <option value="">Select an Option</option>

              {statuses.map((item, key) => (
                <option key={key} value={item.value}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          {/* new task deadline */}
          <div className="flex flex-col">
            <div>Deadline Date for New Task : </div>
            <div className="flex gap-3">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      slotProps={{ textField: { size: "small", maxWidth: 200 } }}
                      onChange={(date) => handleChange("startingNewTaskDeadline", date.$d)}
                      label="From"
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      className="w-3/6"
                      onChange={(date) => handleChange("endingNewTaskDeadline", date.$d)}
                      label="To"
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              variant="contained"
              onClick={() => setFilters(initialFilterState)}
              className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
              Reset
            </button>
            <button
              variant="contained"
              className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
              onClick={handleFilter}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
