// import React, { ReactNode } from "react";
// import { Button } from "@/src/components/atoms/button";
// import { X } from 'lucide-react'
// import { cn } from "@/lib/utils";
// type props = {
//   handleClose: () => void;
//   handleComment: (value: string) => void;
//   Submitbutton: () => void;
//   children?: ReactNode;
//   className?:string;
// }

// const Comment_box = ({ handleClose, handleComment, Submitbutton, children,className }: props) => {
//   return (
//     // <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50">
//     <div className={cn(`bg-white rounded-xl border p-7 md:max-w-[650px] md:max-h-[350px] h-full w-full gap-8 text-black md:text-md font-light flex flex-col items-center justify-center`,className)}>
//       <div className="flex justify-between items-center w-full">
//         <h1 className="text-2xl font-poppins">Comments</h1>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="cursor-pointer "
//           onClick={handleClose}
//         >
//           <X className="h-6 w-6" />
//         </Button>
//       </div>
//       <textarea onChange={(e) => handleComment(e.target.value)} className="h-full w-full max-w-[80%] border-2 rounded-lg p-4 md:max-h-40"
//       />
//       {children}
//       <div className="flex justify-end pt-5 gap-4 w-full">
//         <Button variant={"backbtn"} size={"backbtnsize"} className="py-2" onClick={handleClose}>
//           Back
//         </Button>
//         <Button id="submitButton" variant={"nextbtn"} size={"nextbtnsize"} className={`py-2`} onClick={() => Submitbutton()}>
//           Submit
//         </Button>
//       </div>
//     </div>
//     // </div >
//   );
// };

// export default Comment_box;

import React, { ReactNode } from "react";
import { Button } from "@/src/components/atoms/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type Props = {
  handleClose: () => void;
  handleComment: (value: string) => void;
  Submitbutton: () => void;
  children?: ReactNode;
  className?: string;
};

const Comment_box = ({ handleClose, handleComment, Submitbutton, children, className }: Props) => {
  return (
    <div
      className={cn(
        `bg-white rounded-xl border p-6 md:max-w-[600px] w-full max-h-[400px] flex flex-col gap-5 text-black font-light`,
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Add Comment</h2>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer p-1"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Comment Label */}
      <Label htmlFor="commentBox" className="text-sm font-medium text-gray-700">
        Your Comment
      </Label>

      {/* Textarea */}
      <textarea
        id="commentBox"
        placeholder="Enter your comment here..."
        onChange={(e) => handleComment(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {children}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-3">
        <Button
          variant="backbtn"
          size="backbtnsize"
          className="py-2 px-4"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          id="submitButton"
          variant="nextbtn"
          size="nextbtnsize"
          className="py-2 px-4"
          onClick={Submitbutton}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Comment_box;

