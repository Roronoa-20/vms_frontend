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
          <DialogTitle>Export Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Request Date
          </label>
          <select
            className="w-full p-2 border rounded-md"
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleExport} disabled={!selectedDate}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportMaterialExcelDialog;