import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PiXLight } from "react-icons/pi";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { baseURL } from "../../constant";
import { createFacebookField, fetchFacebookFields } from "../../redux/action/facebook";

const Settings = ({ open, setOpen }) => {
  /////////////////////////////////// VARIABLES //////////////////////////////////
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.facebook);

  const text = baseURL + "/webhooks";

  /////////////////////////////////// STATES /////////////////////////////////////
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    appSecret: "",
    verifyToken: "",
    appId: "",
    pageId: "",
    pageAccessToken: "",
  });

  /////////////////////////////////// USE EFFECTS ////////////////////////////////
  useEffect(() => {
    if (open) {
      dispatch(fetchFacebookFields());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (data) {
      setFormData({
        appSecret: data.appSecret || "",
        verifyToken: data.verifyToken || "",
        appId: data.appId || "",
        pageId: data.pageId || "",
        pageAccessToken: data.pageAccessToken || "",
      });
    }
  }, [data]);

  /////////////////////////////////// FUNCTIONS //////////////////////////////////
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFacebookField(formData));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} fullWidth="sm" maxWidth="sm" onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between">
            <div className="font-primary">Link your Facebook Page</div>
            <div>
              <PiXLight onClick={handleClose} className="text-[25px] cursor-pointer" />
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 font-primary">
          <div className="w-full max-w-md">
            <table className="mt-4 w-full">
              <tr>
                <td className="pb-4 text-lg">Server Callback URL </td>
                <td className="pb-4">
                  <div className="relative">
                    <TextField
                      type="text"
                      value={text}
                      readOnly
                      fullWidth
                      size="small"
                      className={`rounded-lg border px-4 py-2 pr-20 text-gray-700 transition-colors duration-400 ${
                        copied ? "border-green-500 bg-green-100" : "border-gray-300"
                      }`}
                    />
                    <button
                      onClick={handleCopy}
                      className={`ml-5 h-full absolute -right-20 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 text-sm font-medium transition-colors duration-400 ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-red-400 text-white hover:bg-red-500"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">App Secret Key </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("appSecret", e.target.value)}
                    value={formData.appSecret}
                    type="text"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Verify Token </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("verifyToken", e.target.value)}
                    value={formData.verifyToken}
                    type="text"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Page ID </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("pageId", e.target.value)}
                    value={formData.pageId}
                    type="text"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">App ID </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("appId", e.target.value)}
                    value={formData.appId}
                    type="text"
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-16 text-lg">Page Access Token </td>
                <td className="pb-4">
                  <TextField
                    onChange={(e) => handleChange("pageAccessToken", e.target.value)}
                    value={formData.pageAccessToken}
                    type="text"
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary transition-colors duration-300"
            onClick={handleClose}>
            Cancel
          </button>
          <button
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary transition-colors duration-300"
            onClick={handleSubmit}
            autoFocus>
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;
