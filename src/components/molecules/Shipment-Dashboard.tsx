"use client";
import React, { useState } from "react";
import ShipmentStatusTable from "./View-Shipment-Status-Table";
import { sampleData } from "@/src/constants/ShipmentData";
import { entry } from "@/src/types/shipmentEntry";

import {
  Layers,
  Building2,
  PackageCheck,
  Truck,
  Boxes,
  Factory,
  Warehouse,
  ClipboardCheck,
  Plane,
  Ship,
  BadgeCheck,
  Package,
  HandHelping,
} from "lucide-react";

export const entries: entry[] = [
    { id: "142916", title: "Total Entry", color: "bg-green-100 text-green-800", icon: Layers, iconColor: "text-green-600" },
    { id: "443", title: "MLSPL Entry", color: "bg-purple-100 text-purple-800", icon: Building2, iconColor: "text-purple-600" },
    { id: "29447", title: "MLSL Entry", color: "bg-red-100 text-red-800", icon: PackageCheck, iconColor: "text-red-600" },
    { id: "21288", title: "MEPL Entry", color: "bg-pink-100 text-pink-800", icon: Truck, iconColor: "text-pink-600" },
    { id: "25018", title: "MDPL Entry", color: "bg-yellow-100 text-yellow-800", icon: Boxes, iconColor: "text-yellow-600" },
    { id: "39198", title: "MHPL Entry", color: "bg-sky-100 text-sky-800", icon: Factory, iconColor: "text-sky-600" },
    { id: "12827", title: "MCPL Entry", color: "bg-yellow-100 text-yellow-800", icon: Warehouse, iconColor: "text-yellow-600" },
    { id: "6474", title: "MILSPL Entry", color: "bg-green-100 text-green-800", icon: ClipboardCheck, iconColor: "text-green-600" },
    { id: "7145", title: "MMIPL Entry", color: "bg-purple-100 text-purple-800", icon: Plane, iconColor: "text-purple-600" },
    { id: "1035", title: "MNPL Entry", color: "bg-yellow-100 text-yellow-800", icon: Ship, iconColor: "text-yellow-600" },
    { id: "34", title: "MCIPL Entry", color: "bg-pink-100 text-pink-800", icon: BadgeCheck, iconColor: "text-pink-600" },
    { id: "36527", title: "MATERIAL RECE...", color: "bg-orange-100 text-orange-800", icon: Package, iconColor: "text-orange-600" },
    { id: "35792", title: "MATERIAL HAND...", color: "bg-sky-100 text-sky-800", icon: HandHelping, iconColor: "text-sky-600" },
  ];

export default function ShipmentHome() {
  
  const [showShipmentTable, setShowShipmentTable] = useState(false);

  return (
    <div className="p-3 bg-gray-200 min-h-screen">
      <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {entries.map((entry) => {
            const Icon = entry.icon; 
            return (
              <div
                key={entry.id}
                className={`cursor-pointer rounded-lg p-4 shadow-sm ${entry.color} flex items-center justify-between`}
                onClick={() => {
                  if (entry.title === "Total Entry" || entry.title === "MLSPL Entry") {
                    setShowShipmentTable(true);
                  }
                }}
              >
                <div>
                  <p className="text-md">{entry.title}</p>
                  <h3 className="font-semibold">{entry.id}</h3>
                </div>

                <div>
                  {Icon ? (
                    
                    <Icon className={`w-6 h-6 ${entry.iconColor ?? ""}`} />
                  ) : (
                    <div className="w-6 h-6" /> 
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showShipmentTable && <ShipmentStatusTable shipmentData={sampleData} />}
      </div>
    </div>
  );
}
