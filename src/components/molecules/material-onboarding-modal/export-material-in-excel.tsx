'use client';

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MaterialOnboardingDetail {
  request_date?: string;
  [key: string]: any;
}

interface ExportMaterialExcelDialogProps {
  open: boolean;
  onClose: () => void;
  materialOnboardingDetails?: MaterialOnboardingDetail[];
}

const ExportMaterialExcelDialog: React.FC<ExportMaterialExcelDialogProps> = ({
  open,
  onClose,
  materialOnboardingDetails = [],
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    if (materialOnboardingDetails.length > 0) {
      const dates = Array.from(
        new Set(
          materialOnboardingDetails
            .map((d) => d.request_date)
            .filter(Boolean)
            .map((d) => new Date(d as string).toISOString().split("T")[0])
        )
      ).sort();
      setUniqueDates(dates);
    }
  }, [materialOnboardingDetails]);

  const handleExport = () => {
    if (!selectedDate) return;
    window.open(
      `/api/method/your_app.path.to.export_filtered_materials_excel?request_date=${selectedDate}`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-800">Export Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Select Request Date
          </label>
          <select
            className="w-full px-4 py-3 text-sm rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C72F5]/20 focus:border-[#0C72F5] hover:border-slate-300 text-slate-800"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">-- Choose Date --</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-200 hover:bg-slate-50 text-slate-700">
            Close
          </Button>
          <Button onClick={handleExport} disabled={!selectedDate} className="bg-[#0C72F5] hover:bg-[#0C72F5]/90 text-white shadow-sm">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportMaterialExcelDialog;