import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentStats from "./PaymentStats";
import IncomeAndExpense from "./IncomeAndExpense";
import LeadsStat from "./LeadsStat";
import { getNotifications } from "../../redux/action/notification";

const EventCalendar = lazy(() => import("./EventCalendar/EventCalendar"));

function DashBoard() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification?.notifications || []);

  useEffect(() => {
    if (!notifications.length) dispatch(getNotifications());
  }, [dispatch, notifications.length]);

  return (
    <main className="w-full min-w-0 space-y-4 sm:space-y-5 overflow-hidden">
      <PaymentStats />

      <section className="w-full min-w-0 rounded-xl bg-white p-3 sm:p-4 shadow-sm">
        <Suspense fallback={<div className="h-[22rem] w-full animate-pulse rounded-lg bg-slate-100" />}>
          <EventCalendar />
        </Suspense>
      </section>

      <IncomeAndExpense />

      <section className="w-full min-w-0 rounded-xl bg-white p-3 sm:p-5 shadow-sm">
        <LeadsStat />
      </section>
    </main>
  );
}

export default DashBoard;
