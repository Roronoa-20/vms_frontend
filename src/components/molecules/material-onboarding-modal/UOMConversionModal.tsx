import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UOMConversionModalProps {
  open: boolean;
  onClose: () => void;
  baseUOM?: string;
  purchaseUOM?: string;
  issueUOM?: string;
  onSubmit: (values: { numerator: string; denominator: string }) => void;
}

const UOMConversionModal: React.FC<UOMConversionModalProps> = ({ open, onClose, baseUOM, purchaseUOM, issueUOM, onSubmit }) => {
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");

  const handleSubmit = (): void => {
    if (!numerator || !denominator) return;
    onSubmit({ numerator, denominator });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-800">Conversion Ratio</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Numerator"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              className="w-40 px-4 py-3 text-sm rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C72F5]/20 focus:border-[#0C72F5] hover:border-slate-300"
            />
            <span className="text-sm font-bold text-slate-700">{baseUOM}</span>
          </div>

          <span className="text-lg font-semibold">=</span>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Denominator"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              className="w-40 px-4 py-3 text-sm rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C72F5]/20 focus:border-[#0C72F5] hover:border-slate-300"
            />
            <span className="text-sm font-bold text-slate-700">{purchaseUOM || issueUOM}</span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            className="bg-[#0C72F5] hover:bg-[#0C72F5]/90 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UOMConversionModal;