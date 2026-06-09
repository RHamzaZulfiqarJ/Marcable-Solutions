import { Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import React from 'react'
import { deleteCashbook, getPayments } from '../../redux/action/cashbook'
import { useDispatch, useSelector } from 'react-redux'

const DeleteModal = ({ open, setOpen, cashbookId }) => {

  ////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const dispatch = useDispatch()
  const { isFetching, error } = useSelector(state => state.cashbook)

  ////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    dispatch(deleteCashbook(cashbookId))
    dispatch(getPayments());
    setOpen(false)
  }


  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="alert-dialog-title">
        Delete the Cashbook?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this cashbook?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary"
          onClick={handleClose}>
          Cancel
        </button>
        <button
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
          onClick={handleDelete}
          autoFocus>
          Delete
        </button>
      </DialogActions>
    </Dialog >
  )
}

export default DeleteModal