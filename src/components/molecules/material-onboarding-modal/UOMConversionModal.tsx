import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UOMConversionModalProps {
  open: boolean;
  onClose: () => void;
  baseUOM?: string;
  purchaseUOM?: string;
  issueUOM?: string;
  onSubmit: (values: { numerator: string; denominator: string }) => void;
}

const UOMConversionModal: React.FC<UOMConversionModalProps> = ({open, onClose, baseUOM, purchaseUOM, issueUOM, onSubmit }) => {
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");

  const handleSubmit = (): void => {
    if (!numerator || !denominator) return;
    onSubmit({ numerator, denominator });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conversion Ratio</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Numerator"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              className="w-40"
            />
            <span className="text-sm font-medium">{baseUOM}</span>
          </div>

          <span className="text-lg font-semibold">=</span>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Denominator"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              className="w-40"
            />
            <span className="text-sm font-medium">{purchaseUOM || issueUOM}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UOMConversionModal;