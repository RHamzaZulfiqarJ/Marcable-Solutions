import { Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import React from 'react'
import { deleteSale } from '../../redux/action/sale'
import { useDispatch, useSelector } from 'react-redux'

const DeleteModal = ({ open, setOpen, saleId }) => {

  ////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const dispatch = useDispatch()
  const { isFetching, error } = useSelector(state => state.sale)

  ////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    dispatch(deleteSale(saleId))
    setOpen(false)
  }


  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="alert-dialog-title">
        Delete the Sale?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this sale?
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