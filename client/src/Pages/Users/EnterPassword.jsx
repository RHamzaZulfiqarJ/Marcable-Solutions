import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Slide, } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiXLight } from "react-icons/pi";
import { Loader } from "../../utils";
import { updateStatus } from "../../redux/action/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EnterPassword = ({ open, setOpen, type, userId }) => {
  ////////////////////////////////////// VARIABLES  /////////////////////////////////////
  const dispatch = useDispatch();

  const { loggedUser } = useSelector(state => state.user)

  ////////////////////////////////////// STATES  /////////////////////////////////////
  const [password, setPassword] = useState('');

  ////////////////////////////////////// USE EFFECTS  /////////////////////////////////////


  ////////////////////////////////////// FUNCTIONS  /////////////////////////////////////
  const handleUnblock = () => {
  dispatch(updateStatus(userId, true, password));
  setOpen(false);
};

const handleBlock = () => {
  dispatch(updateStatus(userId, false, password));
  setOpen(false);
};

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        fullWidth="xs"
        maxWidth="xs"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-xl text-sky-400 font-primary">{type} User:</div>
          <div className="cursor-pointer" onClick={() => setOpen(false)}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        {/* {isFetching ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : ( */}
          <DialogContent>
            <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
              <table className="w-full">
                <tr>
                  <td className="pb-4 text-lg">Password </td>
                  <td className="pb-4 w-64">
                    <TextField
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="password"
                      size="small"
                      fullWidth
                    />
                  </td>
                </tr>
              </table>
            </div>
          </DialogContent>
        {/* )} */}
        <DialogActions>
          <button
            onClick={() => setOpen(false)}
            variant="contained"
            className="bg-[#d7d7d7] font-primary px-4 py-2 rounded-lg text-gray-100 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-normal transition-all">
            Cancel
          </button>
          <button
            onClick={() => { type == 'Block' ? handleUnblock() : handleBlock() }}
            variant="contained"
            className="bg-primary-red font-primary px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-normal">
            {type}
          </button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default EnterPassword;
