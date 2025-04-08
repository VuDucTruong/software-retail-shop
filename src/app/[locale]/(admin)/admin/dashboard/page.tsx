'use client'

import CardSection from "@/components/dashboard/CardSection";
import { InteractiveLineChart } from "@/components/dashboard/InteractiveLineChart";
import { LastestOrderDataTable } from "@/components/dashboard/LastestOrderTable";
import React from "react";
import rawData from "@/config/data.json"
import { OrderTableItemScheme } from "@/types/order";
export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <CardSection />
      <InteractiveLineChart />
      <LastestOrderDataTable data={OrderTableItemScheme.array().parse(rawData)} />
    </div>
  );
}
