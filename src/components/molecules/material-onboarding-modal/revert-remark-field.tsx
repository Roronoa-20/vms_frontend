import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
}

const RemarkDialog: React.FC<RemarkDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  const [remark, setRemark] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleConfirm = () => {
    if (!remark.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(remark.trim());
    setRemark("");
    onClose();
  };

  const handleCancel = () => {
    setRemark("");
    setError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-800">Enter Remark</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <textarea
            placeholder="Enter your remark"
            value={remark}
            rows={3}
            onChange={(e) => setRemark(e.target.value)}
            className={`w-full px-4 py-3 text-sm rounded-lg bg-white border shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 ${error ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:ring-[#0C72F5]/20 focus:border-[#0C72F5] hover:border-slate-300"
              }`}
          />
          {error && <p className="text-red-500 text-sm">Remark is required.</p>}
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleCancel} size="backbtnsize" variant="backbtn">
            Cancel
          </Button>
          <Button onClick={handleConfirm} size="nextbtnsize" variant="nextbtn">
            Revert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemarkDialog;