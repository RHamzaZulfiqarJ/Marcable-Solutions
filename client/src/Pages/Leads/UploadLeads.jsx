import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createLead, getEmployeeLeads, getLeads, uploadLeadsAction } from "../../redux/action/lead";
import { getProjects } from "../../redux/action/project";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogTitle, Slide, DialogActions, Divider } from "@mui/material";
import { PiUploadSimple, PiXLight } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

const UploadLeads = ({ setOpen, open, scroll }) => {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setIsDragging(false);
    setError("");

    if (rejectedFiles.length > 0) {
      setError("Only Excel files (.xlsx, .xls) are allowed.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setLeadData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (leadData.length === 0) return;
    dispatch(uploadLeadsAction(leadData))
      .then(() => {
        setLeadData([]);
        setOpen(false);
        if (loggedUser.role === "employee") {
          dispatch(getEmployeeLeads());
        } else {
          dispatch(getLeads());
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Dialog
      open={open}
      scroll={scroll}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      fullWidth="sm"
      maxWidth="sm">
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Upload Leads</div>
        <div className="cursor-pointer" onClick={() => setOpen(false)}>
          <PiXLight className="text-[25px]" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
            isDragging
              ? "bg-blue-100 border-blue-400"
              : "bg-gray-50 hover:bg-gray-300 border-gray-600 hover:border-gray-500"
          }`}>
          <input {...getInputProps()} />
          <PiUploadSimple className="text-2xl text-gray-500" />
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Only Excel Files (.xlsx, .xls)</p>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {leadData.length > 0 && (
          <>
            <div className="flex justify-between items-center mt-4">
              <div className="text-md text-gray-700">
                <strong>Preview:</strong> {leadData.length} Leads Loaded
              </div>
              <div className="cursor-pointer" onClick={() => setLeadData([])}>
                <IoClose className="text-lg" />
              </div>
            </div>
            <Divider className="pb-4" />
          </>
        )}
      </DialogContent>
      <DialogActions className="mr-4 mb-2">
        <div className="ml-4 flex flex-row justify-between w-full">
          <div>
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-primary"
              onClick={() => window.open("/Template.xlsx", "_blank")}>
              Download Template
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary"
              onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
              onClick={handleSubmit}
              disabled={leadData.length === 0}>
              Upload
            </button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default UploadLeads;
