'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApproveDialogProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  handleSubmit: () => void;
  buttontext?: string;
  dialogTitle?:string;
}

export const ApproveConfirmationDialog: React.FC<ApproveDialogProps> = ({ open, onClose, handleSubmit, title, buttontext,dialogTitle }) => {
  const [loading, setLoading] = useState(false);

  const onApprove = async () => {
    setLoading(true);
    try {
      await handleSubmit();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle?dialogTitle:"Confirm Approval"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {title ? title : "Are you sure you want to approve this Quotation?"}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onApprove} disabled={loading}>
            {loading ? `${buttontext ? buttontext + "..." : "Approving..."}` : `${buttontext ? buttontext : "Approve"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
