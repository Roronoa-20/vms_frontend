"use client"
import { useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

type entry = {
  id: string;
  title: string;
  color: string;
  textColor: string;
  iconColor: string;
  status: "completed" | "in-progress" | "pending";
};

export default function Home() {
  const [entries, setEntries] = useState([
    { id: '142916', title: 'Total Entry', color: 'bg-green-100 text-green-800', iconColor: 'text-green-600' },
    { id: '443', title: 'MLSPL Entry', color: 'bg-purple-100 text-purple-800', iconColor: 'text-purple-600' },
    { id: '29447', title: 'MLSL Entry', color: 'bg-red-100 text-red-800', iconColor: 'text-red-600' },
    { id: '21288', title: 'MEPL Entry', color: 'bg-pink-100 text-pink-800', iconColor: 'text-pink-600' },
    { id: '25018', title: 'MDPL Entry', color: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-600' },
    { id: '39198', title: 'MHPL Entry', color: 'bg-sky-100 text-sky-800', iconColor: 'text-sky-600' },
    { id: '12827', title: 'MCPL Entry', color: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-600' },
    { id: '6474', title: 'MILSPL Entry', color: 'bg-green-100 text-green-800', iconColor: 'text-green-600' },
    { id: '7145', title: 'MMIPL Entry', color: 'bg-purple-100 text-purple-800', iconColor: 'text-purple-600' },
    { id: '1035', title: 'MNPL Entry', color: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-600' },
    { id: '34', title: 'MCIPL Entry', color: 'bg-pink-100 text-pink-800', iconColor: 'text-pink-600' },
    { id: '36527', title: 'MATERIAL RECE...', color: 'bg-orange-100 text-orange-800', iconColor: 'text-orange-600' },
    { id: '35792', title: 'MATERIAL HAND...', color: 'bg-sky-100 text-sky-800', iconColor: 'text-sky-600' },
  ]);

  const getStatusIcon = (iconColor : string) => (
    <CheckCircleIcon className={`w-6 h-6 ${iconColor}`} />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`rounded-lg p-4 shadow-sm ${entry.color} flex items-center justify-between`}
          >
            <div>
              <p className="text-md">{entry.title}</p>
              <h3 className="font-semibold">{entry.id}</h3>
            </div>

            <div>
              {getStatusIcon(entry.iconColor)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
