import React from "react";
import { Button } from "@/src/components/atoms/button";
import { X } from 'lucide-react'
import { Input } from "../atoms/input";
type props = {
  handleClose: () => void;
  handleComment: (value: string) => void;
  handleDate: (value: string) => void;
  Submitbutton: (status: "approve" | "reject" | "") => void;
  status: "approve" | "reject" | "";
}

const Comment_box = ({ handleClose, handleComment, Submitbutton, handleDate, status }: props) => {
  return (
    <div className="bg-white rounded-xl border p-5 md:max-w-[650px] md:max-h-[350px] w-full text-black md:text-md font-light flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-semibold">Comments</h1>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Delivery Date */}
      <div className="flex flex-col w-full">
        <h1 className={`text-[14px] font-medium ${status === "approve" ? "mt-1 w-[60%]" : "hidden"}`}>Tentative Delivery Date:</h1>
        <Input
          type="date"
          className={`${status === "approve" ? "mt-1 w-[60%]" : "hidden"}`}
          onChange={(e) => handleDate(e.target.value)}
        />
      </div>

      {/* Comment Box */}
      <div className="flex flex-col w-full">
        <h1 className={`text-[14px] font-medium ${status === "reject" ? "mt-1 w-[60%]" : "hidden"}`}>Reason for Rejection:</h1>
        <textarea
          onChange={(e) => handleComment(e.target.value)}
          className={`w-full border-2 rounded-lg p-3 text-[14px] ${status === "reject" ? "block" : "hidden"
            }`}
          rows={4}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-3">
        <Button
          className="py-2 hover:bg-[#5291CD] hover:text-white hover:border-[#5291CD] rounded-[14px]"
          variant="backbtn"
          size="backbtnsize"
          onClick={handleClose}
        >
          Back
        </Button>
        <Button
          variant="nextbtn"
          size="nextbtnsize"
          className="py-2 border border-transparent hover:bg-white hover:text-black hover:border-[#5291CD] rounded-[14px]"
          onClick={() => Submitbutton(status)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Comment_box;
