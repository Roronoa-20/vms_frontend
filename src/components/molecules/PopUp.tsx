import React, { Children, ReactNode, Ref } from "react";
import { Button } from "@/src/components/atoms/button";
import { X } from 'lucide-react'
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { cn } from "@/lib/utils";
type props = {
  handleClose: () => void;
  children?: ReactNode;
  headerText?:string
  isSubmit?:boolean
  Submitbutton?:()=>void
  classname?:string
  disableRef?:boolean
}

const PopUp = ({ handleClose,children,headerText,isSubmit,Submitbutton, classname,disableRef}: props) => {
  const DialogRef = useOutsideClick<HTMLDivElement>(handleClose)
  return (
     <div className="absolute z-50 inset-0 flex items-center justify-center bg-black bg-opacity-20">
    <div ref={!disableRef?null:DialogRef}  className={cn(`bg-white rounded-xl border p-4 md:max-w-[450px] md:max-h-[300px] w-full gap-8 text-black md:text-md font-light`,classname)}>
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-poppins">{headerText}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer "
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      {children}
      <div className="flex justify-end pt-2 gap-4 w-full">
        <Button className="py-2" variant={"backbtn"} size={"backbtnsize"} onClick={handleClose}>
          Back
        </Button>
        {
          isSubmit &&
          <Button className={`py-2`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => {Submitbutton && Submitbutton()}}>
          Submit
        </Button>
        }
      </div>
    </div>
     </div >
  );
};

export default PopUp;
