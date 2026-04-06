import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SAPMaterialModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  materialCode: string;
  materialDescription: string;
  isZCAPMaterial?: boolean;
}

const SAPMaterialModal: React.FC<SAPMaterialModalProps> = ({
  isOpen,
  onClose,
  materialCode,
  materialDescription,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-800">
            SAP Material Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              SAP Material Code
            </label>
            <input
              type="text"
              value={materialCode}
              readOnly
              className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Material Description
            </label>
            <input
              type="text"
              value={materialDescription}
              readOnly
              className="w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/80 shadow-sm text-slate-800 font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400 focus:outline-none cursor-default"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SAPMaterialModal;