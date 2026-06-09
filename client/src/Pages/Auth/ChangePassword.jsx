import {
  Alert,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Snackbar,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, register } from "../../redux/action/user";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PiEyeSlashThin, PiEyeThin, PiX, PiXLight } from "react-icons/pi";
import { Modal, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ChangePassword = ({ open, setOpen }) => {
  const PasswordButtonInitialStyle = { opacity: 0 };

  /////////////////////////////////// VARIABLES /////////////////////////////////
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, error } = useSelector((state) => state.user);

  /////////////////////////////////// STATES /////////////////////////////////////
  const [passwordData, setPasswordData] = useState({ newPassword: "", oldPassword: "" });
  const [inputError, setInputError] = useState({ newPassword: "", oldPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordButton, setShowPasswordButton] = useState(PasswordButtonInitialStyle);
  const [showSnackbar, setShowSnackbar] = useState(false);

  //////////////////////////////////////// USE EFFECTS ////////////////////////////////

  /////////////////////////////////// FUNCTIONS //////////////////////////////////
  const handleChange = (field, value) => {
    setPasswordData((pre) => ({ ...pre, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = passwordData;

    if (!oldPassword)
      return setInputError((pre) => ({ ...pre, firstName: "Previous password is required" }));
    if (!newPassword)
      return setInputError((pre) => ({ ...pre, firstName: "New password is required" }));
    if (newPassword < 6)
      return setInputError((pre) => ({
        ...pre,
        firstName: "New password length should contain atleast 6 characters.",
      }));

    dispatch(changePassword(passwordData, navigate));
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} fullWidth="sm" onClose={() => setOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between">
            <div className="font-primary">Change Password</div>
            <div>
              <PiXLight onClick={() => setOpen(false)} className="text-[25px] cursor-pointer" />
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <div>
            <TextField
              value={passwordData.oldPassword}
              placeholder="Enter Your Old Password"
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              size="small"
              fullWidth
              type="password"
            />
          </div>
          <div>
            <TextField
              value={passwordData.newPassword}
              placeholder="Enter Your New Password"
              onChange={(e) => handleChange("newPassword", e.target.value)}
              size="small"
              fullWidth
              type="password"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary"
            onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
            onClick={handleSubmit}
            autoFocus>
            Change
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangePassword;