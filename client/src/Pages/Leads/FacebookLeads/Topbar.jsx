import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../../../utils";
import { FormControl, Input, InputAdornment, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { PiMagnifyingGlass } from "react-icons/pi";
import { IoRefresh } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { getPendingLeads } from "../../../redux/action/facebookLeads";
import Filter from "./Filter";

const Topbar = ({ userId, filter, setFilter }) => {
  ////////////////////////////////////////// VARIABLES ///////////////////////////////////
  const dispatch = useDispatch();
  ////////////////////////////////////////// STATES //////////////////////////////////////
  const [openFilters, setOpenFilters] = useState(false);

  ////////////////////////////////////////// USE EFFECTS /////////////////////////////////

  ////////////////////////////////////////// FUNCTIONS ///////////////////////////////////

  const handleToggleFilters = () => {
    setOpenFilters((prev) => !prev);
  };

  const handleRefreshLeads = () => {
    dispatch(getPendingLeads(userId));
  }

  return (
    <div className="flex flex-col tracking-wide pb-8 font-primary">
      <div className="w-full text-[14px]">
        <Path />
      </div>

      <div className="md:flex justify-between items-center flex-none">
        <h1 className="text-primary-blue text-[32px] capitalize font-light">Facebook Leads</h1>
          <div className="flex items-center justify-end gap-2 md:mt-0 mt-4">
            <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
              <FormControl>
                <Input
                  name="search"
                  value={""}
                  placeholder="Search Leads"
                  startAdornment={
                    <InputAdornment position="start">
                      <PiMagnifyingGlass className="text-[25px]" />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <Tooltip title="Refresh" arrow placement="top">
              <div
                onClick={handleRefreshLeads}
                className={` p-2 rounded-md cursor-pointer active:text-[#20aee3] bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]`}>
                <IoRefresh className="text-[25px]" />
              </div>
            </Tooltip>
            <Tooltip title="Filter" arrow placement="top">
              <div
                onClick={handleToggleFilters}
                className="p-2 rounded-md cursor-pointer bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]">
                <FiFilter className="text-[25px] " />
              </div>
            </Tooltip>
          </div>
      </div>

      <Filter openFilter={openFilters} setOpenFilter={setOpenFilters} filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default Topbar;
