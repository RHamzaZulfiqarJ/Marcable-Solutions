import React, { useEffect, useState } from "react";
import { Drawer, Button, TextField, Autocomplete, Select, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { filterLead } from "../../redux/action/lead";
import { FiFilter } from "react-icons/fi";
import { PiFunnelLight, PiXLight } from "react-icons/pi";
import { countries, pakistanCities } from "../../constant";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { filterLeadReducer } from "../../redux/reducer/lead";
import { getEmployees } from "../../redux/action/user";
import { getProjects } from "../../redux/action/project";
import { CFormSelect } from "@coreui/react";

const FilterDrawer = ({ open, setOpen, setIsFiltered, filters, setFilters }) => {
  
  //////////////////////////////// VARIABLES ///////////////////////////////////////////////////

  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.project);
  const { employees } = useSelector((state) => state.user);
  const { loggedUser } = useSelector((state) => state.user);

  let role = loggedUser?.role;

  const priorities = [
    { name: "Very Cold", value: "veryCold" },
    { name: "Cold", value: "cold" },
    { name: "Moderate", value: "moderate" },
    { name: "Hot", value: "hot" },
    { name: "Very Hot", value: "veryHot" },
  ];

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

  const sources = [
    { name: "Instagram", value: "instagram" },
    { name: "Facebook Comment", value: "facebookComment" },
    { name: "Friend and Family", value: "friendAndFamily" },
    { name: "Facebook", value: "facebook" },
    { name: "Direct Call", value: "directCall" },
    { name: "Google", value: "google" },
    { name: "Referral", value: "referral" },
  ];
  
  const initialFilterState = {
    city: "",
    startingDate: "",
    endingDate: "",
    status: "",
    priority: "",
    source: "",
    property: "",       // correct name used in leads.jsx
    allocatedTo: "",    // correct name used in leads.jsx
  };

  const projectList = projects.map((project) => ({
    name: project.title,
    value: project?._id,
  }));

  const employeeList = employees.map((employee) => ({
    name: employee.firstName + " " + employee.lastName,
    value: employee?._id,
  }));

  //////////////////////////////// STATES ///////////////////////////////////////////////////
  const [initFilters, setInitFilters] = useState(initialFilterState);

  //////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getEmployees());
  }, [open]);

  //////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
  const handleFilter = () => {
    setIsFiltered(true);
    setFilters(initFilters);
    setOpen(false);
    setInitFilters(initialFilterState);
  };

  const handleChange = (field, value) => {
    setInitFilters((pre) => ({ ...pre, [field]: value }));
  };

  const handleCancel = () => {
    setInitFilters(initialFilterState);
    setIsFiltered(false);
    setOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="font-primary" style={{ minWidth: "50vh", maxWidth: "60vh" }}>
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
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={pakistanCities}
            onChange={(e, value) => handleChange("city", value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" fullWidth label="City" />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={priorities}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.value === value}
            onChange={(e, input) => handleChange("priority", input?.value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" label="Priority" fullWidth />
            )}
          />

          <div className="flex flex-col">
            <div>Date : </div>
            <div className="flex gap-3">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      onChange={(date) => handleChange("startingDate", date.$d)}
                      slotProps={{ textField: { size: "small", maxWidth: 200 } }}
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
                      label="To"
                      onChange={(date) => handleChange("endingDate", date.$d)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={statuses}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.value === value}
            onChange={(e, value) => handleChange("status", value?.value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" fullWidth label="Status" />
            )}
          />

          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={sources}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.value === value}
            onChange={(e, value) => handleChange("source", value?.value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" fullWidth label="Source" />
            )}
          />

          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={projectList}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => handleChange("property", value?.value)}
            className="w-full"
            renderInput={(params) => <TextField {...params} label="Project" />}
          />

          {role == "super_admin" && (
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={employeeList}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => handleChange("allocatedTo", value?.value)}
              className="w-full"
              renderInput={(params) => <TextField {...params} label="Employee" />}
            />
          )}

          <div className="flex gap-4 justify-end">
            <button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary">
              Cancel
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
              onClick={handleFilter}
              autoFocus>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
