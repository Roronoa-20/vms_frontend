import React, { Children, ReactNode, Ref } from "react";
import { Button } from "@/src/components/atoms/button";
import { X } from 'lucide-react'
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { cn } from "@/lib/utils";
type props = {
  handleClose: () => void;
  children?: ReactNode;
  headerText?: string
  isSubmit?: boolean
  Submitbutton?: () => void
  classname?: string
  disableRef?: boolean
  showBackButton?: boolean
  padding?: string
  submitLabel?: string
}

const PopUp = ({ handleClose, children, headerText, isSubmit, Submitbutton, classname, disableRef, showBackButton = true, padding = "p-6", submitLabel = "Submit" }: props) => {
  const DialogRef = useOutsideClick<HTMLDivElement>(handleClose)
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-10 p-2">
      <div
        ref={!disableRef ? null : DialogRef}
        className={cn(
          `bg-white rounded-xl shadow-lg border md:max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden`,
          padding,
          classname
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center border-b mb-2">
          <h1 className="text-xl font-semibold text-gray-800">{headerText}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={handleClose}
          >
            <X className="h-6 w-6 text-gray-600 hover:text-red-600" />
          </Button>
        </div>

        {/* Content (scrollable only here) */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end pt-2 gap-3">
          {showBackButton && (
            <Button
              className="px-3"
              onClick={handleClose}
              variant="backbtn"
              size="backbtnsize"
            >
              Back
            </Button>
          )}
          {isSubmit && (
            <Button
              className="px-3"
              variant="nextbtn"
              size="nextbtnsize"
              onClick={() => {
                Submitbutton && Submitbutton();
              }}
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
