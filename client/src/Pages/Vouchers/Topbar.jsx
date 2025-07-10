import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Add, TableBar, ViewKanban } from "@mui/icons-material";
import { Path } from "../../utils";
import { FormControl, IconButton, Input, InputAdornment } from "@mui/material";
import CreateVoucher from "./CreateVoucher";
import { searchVoucherReducer } from "../../redux/reducer/voucher";
import { PiMagnifyingGlass } from "react-icons/pi";

const Topbar = ({ search, setSearch }) => {
  //////////////////////////////////// VARIABLES ///////////////////////////////////////////////
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = pathname.split("/")[1];
  const pathArr = pathname.split("/").filter((item) => item != "");
  const showAddButton = !pathArr.includes("create");

  //////////////////////////////////// STATES ///////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  //////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////

  //////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm)
  };
  const handleAddClick = () => {
    navigate(`${pathname}/create`);
  };

  const handleCreateopen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full text-[14px] ">
        <Path />
      </div>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-primary-blue text-[32px] capitalize">{title}</h1>

        {showAddButton && (
          <div className="flex items-center gap-2">
            <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
              <FormControl>
                <Input
                  name="search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search Employees"
                  startAdornment={
                    <InputAdornment position="start">
                      <PiMagnifyingGlass className="text-[25px]" />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <button
              onClick={handleCreateopen("body")}
              className="bg-primary-red text-white w-[44px] h-[44px] flex justify-center items-center rounded-full shadow-lg">
              <Add />
            </button>
          </div>
        )}
      </div>
      <CreateVoucher open={open} setOpen={setOpen} scroll={scroll} />
    </div>
  );
};

export default Topbar;
