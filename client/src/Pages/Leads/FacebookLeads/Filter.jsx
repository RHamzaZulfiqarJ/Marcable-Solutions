import React from 'react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export default function Filter({ openFilter, setOpenFilter, filter, setFilter }) {
  const open = Boolean(openFilter);

  const handleClose = () => {
    setOpenFilter(null);
  };

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={openFilter}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        sx={{ mt: '135px', width: '100%' }}
      >
        <div className='w-full p-4 items-center justify-center flex flex-col gap-2 font-primary'>
            <div className='w-full flex flex-row justify-between items-center gap-8'>
                <div>Pending Leads</div>
                <FormGroup>
                    <FormControlLabel
                        className="text-gray-400"
                        onClick={() => setFilter({ ...filter, pending: !filter.pending })}
                        control={<Checkbox checked={filter.pending} style={{ color: "#20aee3" }} />}
                    />
                </FormGroup>
            </div>
            <Divider />
            <div className='w-full flex flex-row justify-between items-center gap-8'>
                <div>Rejected Leads</div>
                <FormGroup>
                    <FormControlLabel
                        className="text-gray-400"
                        onClick={() => setFilter({ ...filter, rejected: !filter.rejected })}
                        control={<Checkbox checked={filter.rejected} style={{ color: "#20aee3" }} />}
                    />
                </FormGroup>
            </div>
            <Divider />
            <div className='w-full flex flex-row justify-between items-center gap-8'>
                <div>Accepted Leads</div>
                <FormGroup>
                    <FormControlLabel
                        className="text-gray-400"
                        onClick={() => setFilter({ ...filter, accepted: !filter.accepted })}
                        control={<Checkbox checked={filter.accepted} style={{ color: "#20aee3" }} />}
                    />
                </FormGroup>
            </div>
        </div>
      </Menu>
    </div>
  );
}
