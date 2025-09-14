import React, { useState } from "react";
import Topbar from "./Topbar";
import AllFollowUpsTable from "./AllFollowUpsTable";

const AllFollowUps = () => {

  const [showButtons, setShowButtons] = useState(true);
  const [options, setOptions] = useState("");

  const handleSelectOption = (option) => {
    setOptions(option);
    setShowButtons(false);
  };

  return (
    <div className="w-full">
      <Topbar />
      {showButtons && (
        <div className="flex justify-center items-center h-full flex-row gap-10">
          <button onClick={() => handleSelectOption("today")} className="bg-red-400 border-[1px] border-white rounded-full p-4 text-white transition-all duration-300 hover:bg-red-500">Today Follow Ups</button>
          <button onClick={() => handleSelectOption("all")} className="bg-blue-400 border-[1px] border-white rounded-full p-8 text-white transition-all duration-300 hover:bg-blue-500 text-2xl">All Follow Ups</button>
          <button onClick={() => handleSelectOption("month")} className="bg-red-400 border-[1px] border-white rounded-full p-4 text-white transition-all duration-300 hover:bg-red-500">This Month's Follow Ups</button>
        </div>
      )}
      {showButtons ? null : (
        <AllFollowUpsTable
        option={options}
      /> 
      )}
    </div>
  );
};

export default AllFollowUps;