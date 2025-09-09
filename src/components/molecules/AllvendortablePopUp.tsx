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
}

const PopUp = ({ handleClose, children, headerText, isSubmit, Submitbutton, classname, disableRef }: props) => {
  const DialogRef = useOutsideClick<HTMLDivElement>(handleClose)
  return (
    <div className="absolute z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div
        ref={!disableRef ? null : DialogRef}
        className={cn(
          `bg-white rounded-xl shadow-lg border p-6 md:max-w-3xl w-full max-h-[85vh] flex flex-col`,
          classname
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        <div className="flex justify-end pt-4 gap-3 border-t mt-4">
          <Button
            className="bg-white text-gray-700 border text-sm px-5 rounded-md hover:bg-gray-100"
            onClick={handleClose}
            variant="backbtn"
            size="backbtnsize"
          >
            Back
          </Button>
          {isSubmit && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 rounded-md"
              onClick={() => {
                Submitbutton && Submitbutton();
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>

  );
};

export default PopUp;
