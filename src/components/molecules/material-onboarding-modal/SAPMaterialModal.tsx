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
          <DialogTitle className="text-xl">
            SAP Material Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SAP Material Code
            </label>
            <input
              type="text"
              value={materialCode}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Material Description
            </label>
            <input
              type="text"
              value={materialDescription}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SAPMaterialModal;