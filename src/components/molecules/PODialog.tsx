import React from "react";
import { Button } from "@/src/components/atoms/button";
import { X } from 'lucide-react'
import { Input } from "../atoms/input";
type props = {
  handleClose: () => void;
  handleComment: (value: string) => void;
  handleDate:(value:string)=>void;
  Submitbutton: (status:"approve"|"reject" | "") => void;
  status:"approve" | "reject" | "";
}

const Comment_box = ({ handleClose, handleComment, Submitbutton, handleDate, status }: props) => {
  return (
    // <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl border p-7 md:max-w-[650px] md:max-h-[350px] h-full w-full gap-8 text-black md:text-md font-light flex flex-col items-center justify-center">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-poppins">Comments</h1>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer "
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <Input type="date" className={`${status == "approve"?"":"hidden"}`} onChange={(e)=>{handleDate(e.target.value)}}/>
      <textarea onChange={(e) => handleComment(e.target.value)} className={`h-full w-full max-w-[80%] border-2 rounded-lg p-4 md:max-h-40 ${status == "reject"?"":"hidden"}`}
      />
      <div className="flex justify-end pt-5 gap-4 w-full">
        <Button className="bg-white text-black border text-xs font-normal px-8 rounded-md hover:bg-white" onClick={handleClose}>
          Back
        </Button>
        <Button className={`text-white text-sm font-normal border px-4`} onClick={() => Submitbutton(status)}>
          Submit
        </Button>
      </div>
    </div>
    // </div >
  );
};

export default Comment_box;
