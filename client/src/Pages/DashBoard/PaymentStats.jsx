import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPayments } from "../../redux/action/cashbook";
import { CiCreditCard1 } from "react-icons/ci";

const StatCard = memo(({ value, label, borderClass, iconClass }) => (
  <Link to="/cashbook" className="block min-w-0">
    <div className={`h-full rounded-xl bg-white p-4 shadow-sm border-b-[3px] ${borderClass} transition hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-center justify-between gap-3 font-primary">
        <div className="min-w-0">
          <p className="truncate text-xl sm:text-2xl font-semibold text-[#455a64]">${value || 0}</p>
          <p className="mt-1 text-sm sm:text-base text-slate-500 text-opacity-70">{label}</p>
        </div>
        <CiCreditCard1 className={`shrink-0 text-[42px] sm:text-[50px] ${iconClass}`} />
      </div>
    </div>
  </Link>
));

const PaymentStats = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.cashbook?.payments);

  useEffect(() => {
    if (!payments) dispatch(getPayments());
  }, [dispatch, payments]);

  return (
    <section className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard value={payments?.todayReceived} label="Payments - Today" borderClass="border-b-emerald-300" iconClass="text-emerald-300" />
      <StatCard value={payments?.thisMonthReceived} label="Payments - This Month" borderClass="border-b-sky-400" iconClass="text-sky-400" />
      <StatCard value={payments?.thisYearReceived} label="Payments - This Year" borderClass="border-b-amber-400" iconClass="text-amber-400" />
    </section>
  );
};

export default memo(PaymentStats);
