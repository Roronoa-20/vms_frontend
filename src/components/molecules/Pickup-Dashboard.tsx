"use client";
import React, { useState } from "react";
import ViewPickupRequest from "./View-Pickup-Request";
import { pickupsData } from "@/src/constants/pickupData";
//import { entry } from "@/src/types/shipmentEntry";
import { CardsItem } from "@/src/types/Cards-Type";

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
} from "lucide-react";

export const entries: CardsItem[] = [
    { id: "4157", title: "Total MPN", color: "bg-[rgba(248, 246, 255, 1)] text-[rgba(101,47,187,1)] ", icon: Layers, iconColor: "text-[rgba(101,47,187,1)]" },
    { id: "5", title: "MLSPL Entry", color: "bg-[rgba(255,244,235,1)] text-[rgba(178,91,15,1)]", icon: Building2, iconColor: "text-[rgba(178,91,15,1)]" },
    { id: "800", title: "MLSPL MPN", color: "bg-[rgba(255,237,238,1)] text-[rgba(159,18,57,1)]", icon: PackageCheck, iconColor: "text-[rgba(159,18,57,1)]" },
    { id: "729", title: "MDPL MPN", color: "bg-[rgba(248, 246, 255, 1)] text-[rgba(101,47,187,1)]", icon: PackageCheck, iconColor: "text-[rgba(101,47,187,1)]" },
    { id: "868", title: "MEPL MPN", color: "bg-[rgba(255,243,255,1)] text-[rgba(154,32,149,1)]", icon: Truck, iconColor: "text-[rgba(154,32,149,1)]" },
    { id: "1259", title: "MHPL MPN", color: "bg-[rgba(254,255,237,1)] text-[rgba(104,114,0,1)]", icon: Boxes, iconColor: "text-[rgba(104,114,0,1)]" },
    { id: "1", title: "MCPL MPN", color: "bg-[rgba(230,250,255,1)] text-[rgba(0,148,185,1)]", icon: Factory, iconColor: "text-[rgba(0,148,185,1)]" },
    { id: "43", title: "MILSPL MPN", color: "bg-[rgba(254,255,237,1)] text-[rgba(104,114,0,1)]", icon: Warehouse, iconColor: "text-[rgba(104,114,0,1)]" },
    { id: "399", title: "MMIPL MPN", color: "bg-[rgba(235,255,245,1)] text-[rgba(6,95,70,1)]", icon: ClipboardCheck, iconColor: "text-[rgba(6,95,70,1)]" },
    { id: "52", title: "MNPL MPN", color: "bg-[rgba(255,237,238,1)] text-[rgba(159,18,57,1)]", icon: Plane, iconColor: "text-[rgba(159,18,57,1)]" },
    { id: "0", title: "MCIPL", color: "bg-[rgba(235,255,245,1)] text-[rgba(6,95,70,1)]", icon: Ship, iconColor: "text-[rgba(104,114,0,1)]" }
  ];

export default function PickupHome() {
  const [showPickupTable, setShowPickupTable] = useState(false);

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
                onClick={() => setShowPickupTable(entry.title === "Total MPN")}
              >
                <div>
                  <p className="text-md">{entry.title}</p>
                  <h3 className="font-semibold">{entry.id}</h3>
                </div>
                <div>
                  {Icon ? <Icon className={`w-6 h-6 ${entry.iconColor ?? ""}`} /> : <div className="w-6 h-6" />}
                </div>
              </div>
            );
          })}
        </div>

        {showPickupTable && <ViewPickupRequest pickupData={pickupsData} />}
      </div>
    </div>
  );
}
