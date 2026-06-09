import React, { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getIncomeAndExpenses } from "../../redux/action/cashbook";
import { Loader } from "../../utils";

const IncomeAndExpense = () => {
  const dispatch = useDispatch();
  const incomeAndExpenses = useSelector((state) => state.cashbook?.incomeAndExpenses || []);
  const isFetching = useSelector((state) => state.cashbook?.isFetching);
  const currentYear = new Date().getFullYear();

  const totals = useMemo(() => {
    return incomeAndExpenses.reduce(
      (acc, item) => ({
        income: acc.income + Number(item.income || 0),
        expense: acc.expense + Number(item.expense || 0),
      }),
      { income: 0, expense: 0 }
    );
  }, [incomeAndExpenses]);

  useEffect(() => {
    if (!incomeAndExpenses.length) dispatch(getIncomeAndExpenses());
  }, [dispatch, incomeAndExpenses.length]);

  return (
    <section className="w-full min-w-0 rounded-xl bg-white p-3 sm:p-5 shadow-sm font-primary">
      <div className="h-[22rem] sm:h-[28rem] w-full min-w-0">
        {isFetching && !incomeAndExpenses.length ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeAndExpenses} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={42} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xl sm:text-3xl font-extralight">{currentYear}</p>
          <p className="text-xs sm:text-sm font-thin text-gray-600">Period</p>
        </div>
        <div>
          <p className="text-xl sm:text-3xl font-extralight">${totals.income}</p>
          <p className="text-xs sm:text-sm font-thin text-gray-600">Income</p>
        </div>
        <div>
          <p className="text-xl sm:text-3xl font-extralight">${totals.expense}</p>
          <p className="text-xs sm:text-sm font-thin text-gray-600">Expenses</p>
        </div>
      </div>
    </section>
  );
};

export default memo(IncomeAndExpense);
