import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLead, updateLead } from "../../redux/action/lead";
import { pakistanCities, countries } from "../../constant";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiUser, PiXLight } from "react-icons/pi";
import { CFormSelect } from "@coreui/react";
import { getLeadReducer } from "../../redux/reducer/lead";
import { getProjects } from "../../redux/action/project";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditModal = ({ open, setOpen, scroll, leadId }) => {
  ////////////////////////////////////// VARIABLES  /////////////////////////////////////
  const dispatch = useDispatch();
  const { currentLead, isFetching } = useSelector((state) => state.lead);
  const { projects } = useSelector((state) => state.project);
  const { employees, loggedUser } = useSelector((state) => state.user);
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
    { name: "Friend and Family", value: "FriendAndFamily" },
    { name: "Facebook", value: "facebook" },
    { name: "Direct Call", value: "directCall" },
    { name: "Google", value: "google" },
    { name: "Referral", value: "referral" },
  ];
  const degrees = [
    { name: "Bacholers", value: "bacholers" },
    { name: "Masters", value: "masters" },
    { name: "PHD", value: "phd" },
    { name: "Diploma", value: "diploma" },
    { name: "Other", value: "other" },
  ];
  const Visa = [
    { name: "Student Visa", value: "studentVisa" },
    { name: "Visit Visa", value: "visitVisa" },
  ];

  let initialLeadState = {
    clientName: "",
    clientPhone: "",
    city: "",
    description: "",
    property: "",
    area: "",
    priority: "",
    status: "",
    source: "",
  };
  ////////////////////////////////////// STATES  //////////////////////////////////////////
  const [leadData, setLeadData] = useState({
    ...currentLead,
    clientName: currentLead?.client?.clientName,
    clientPhone: currentLead?.client?.phone,
  });

  ////////////////////////////////////// USE EFFECTS  /////////////////////////////////////
  useEffect(() => {
    setLeadData({
      ...currentLead,
      clientName: currentLead?.client?.clientName,
      clientPhone: currentLead?.client?.phone,
    });
  }, [currentLead]);

  useEffect(() => {
    leadId && dispatch(getLead(leadId));
  }, [leadId]);

  useEffect(() => {
    dispatch(getProjects());
  }, []);

  ////////////////////////////////////// FUNCTIONS  /////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      clientName,
      clientPhone,
      country,
      priority,
      status,
      degree,
      area,
      major,
      visa,
      source,
      description,
    } = leadData;

    dispatch(updateLead(currentLead?._id, leadData));
    dispatch(getLeadReducer(null));
    setLeadData(initialLeadState);
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setLeadData((pre) => ({ ...pre, [field]: value }));
  };

  const handleClose = () => {
    setLeadData(initialLeadState)
    setOpen(false);
  };


  return (
    <div>
      <Dialog
        open={open}
        scroll={scroll}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="md"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Edit Lead</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiUser />
              <span>Client Details</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">Client Name </td>
                <td className="pb-4">
                  <TextField
                    value={
                      leadData?.clientName
                    }
                    name={"clientName"}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    name="clientPhone"
                    onChange={(e) => handleChange("clientPhone", e.target.value)}
                    value={leadData?.clientPhone}
                    type="number"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
            </table>
          </div>

          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad />
              <span>Client Requirements</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">City </td>
                <td className="pb-4">
                  <CFormSelect
                    value={leadData?.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer text-black">
                    <option value="">Select Country</option>
                    {pakistanCities.map((city, key) => (
                      <option key={key} value={city}>
                        {city}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Project </td>
                <td className="pb-4">
                  <CFormSelect
                    value={leadData?.property?.title}
                    onChange={(e) => handleChange("property", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer text-black">
                    <option value="">Select an Option</option>
                    {projects.map((item, key) => (
                      <option key={item._id} value={item.title}>
                        {item.title}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Area in Marla </td>
                <td className="pb-4">
                  <TextField
                    name="area"
                    onChange={(e) => handleChange("area", e.target.value)}
                    value={leadData.area}
                    type="number"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Priority </td>
                <td className="pb-4">
                  <CFormSelect
                    value={leadData?.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer text-black">
                    <option value="">Select Priority</option>
                    {priorities.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Status </td>
                <td className="pb-4">
                  <CFormSelect
                    value={leadData?.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer text-black">
                    <option value="">Select Status</option>
                    {statuses.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg flex mt-1 items-start">Source </td>
                <td className="pb-4">
                  <CFormSelect
                    value={leadData?.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                    className="border-[1px] p-2 rounded-md w-full border-[#c1c1c1] cursor-pointer text-black">
                    <option value="">Select Source</option>
                    {sources.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                </td>
              </tr>
              <tr>
                <td className="flex flex-col justify-start mt-1 text-lg">Description </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("description", e.target.value)}
                    value={leadData?.description}
                    name="description"
                    type="text"
                    size="small"
                    fullWidth
                    multiline
                    rows={5}
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions className="mr-4 mb-2">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary"
            onClick={handleClose}>
            Cancel
          </button>
          <button
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
            onClick={handleSubmit}
            autoFocus>
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditModal;
