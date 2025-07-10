import { Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import React from 'react'
import { deleteUser } from '../../redux/action/user'
import { useDispatch, useSelector } from 'react-redux'

const DeleteModal = ({ open, setOpen, userId }) => {

  ////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const { isFetching, error } = useSelector(state => state.user)
  const dispatch = useDispatch()

  ////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    dispatch(deleteUser(userId))
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="alert-dialog-title">
        Delete the User?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-gray-500 px-4 py-2 rounded-lg  mt-4 text-white hover:bg-gray-600 border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            variant="contained"
            onClick={handleDelete}
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? "Deleting..." : "Delete"}
          </button>
      </DialogActions>
    </Dialog >
  )
}

export default DeleteModal