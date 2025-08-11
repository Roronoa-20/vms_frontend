// components/AttachmentsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type Attachment = {
  document_name: string;
  attach: string;
  file_url: string;
};

interface AttachmentsDialogProps {
  attachments: Attachment[];
}

export const AttachmentsDialog: React.FC<AttachmentsDialogProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return <span>-</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Attachments</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center justify-between border-b py-1">
              <span className="text-sm truncate">{file.document_name}</span>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
