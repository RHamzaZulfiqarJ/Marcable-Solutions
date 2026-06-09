import { MenuItem, Select } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getLeadsStat } from "../../redux/action/lead";
import { useDispatch, useSelector } from "react-redux";

const LeadsStat = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.lead?.stats || []);
  const [type, setType] = useState("priority");

  useEffect(() => {
    dispatch(getLeadsStat(type));
  }, [dispatch, type]);

  return (
    <div className="w-full min-w-0 font-primary">
      <div className="flex flex-col items-start justify-between gap-3 pb-5 sm:flex-row sm:items-center">
        <h2 className="text-lg sm:text-xl">View Leads</h2>
        <div className="w-full sm:w-64">
          <Select value={type} onChange={(event) => setType(event.target.value)} fullWidth size="small" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
            <MenuItem value="property">Projects Wise</MenuItem>
            <MenuItem value="status">Status Wise</MenuItem>
            <MenuItem value="priority">Priority Wise</MenuItem>
            <MenuItem value="source">Source Wise</MenuItem>
          </Select>
        </div>
      </div>

      <div className="h-[22rem] sm:h-[31rem] w-full min-w-0 overflow-x-auto">
        <div className="h-full min-w-[42rem] sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats} margin={{ top: 5, right: 12, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} width={42} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default memo(LeadsStat);
