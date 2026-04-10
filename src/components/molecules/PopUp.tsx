// import React, { Children, ReactNode, Ref } from "react";
// import { Button } from "@/src/components/atoms/button";
// import { X } from 'lucide-react'
// import { useOutsideClick } from "@/src/hooks/useOutsideClick";
// import { cn } from "@/lib/utils";
// type props = {
//   handleClose: () => void;
//   children?: ReactNode;
//   headerText?: string
//   isSubmit?: boolean
//   Submitbutton?: () => void
//   classname?: string
//   disableRef?: boolean
// }

// const PopUp = ({ handleClose, children, headerText, isSubmit, Submitbutton, classname, disableRef }: props) => {
//   const DialogRef = useOutsideClick<HTMLDivElement>(handleClose)
//   return (
//     <div className="absolute z-50 inset-0 flex items-center justify-center bg-black bg-opacity-20">
//       <div ref={!disableRef ? null : DialogRef} className={cn(`bg-white rounded-xl border p-4 md:max-w-[450px] md:max-h-[300px] w-full gap-8 text-black md:text-md font-light`, classname)}>
//         <div className="flex justify-between items-center w-full">
//           <h1 className="text-2xl font-poppins">{headerText}</h1>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="cursor-pointer "
//             onClick={handleClose}
//           >
//             <X className="h-6 w-6" />
//           </Button>
//         </div>
//         {children}
//         <div className="flex justify-end pt-2 gap-4 w-full">
//           <Button className="py-2" variant={"backbtn"} size={"backbtnsize"} onClick={handleClose}>
//             Back
//           </Button>
//           {
//             isSubmit &&
//             <Button className={`py-2`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { Submitbutton && Submitbutton() }}>
//               Submit
//             </Button>
//           }
//         </div>
//       </div>
//     </div >
//   );
// };

// export default PopUp;
import React, { ReactNode } from "react";
import { Button } from "@/src/components/atoms/button";
import { X, Loader2 } from "lucide-react";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { cn } from "@/lib/utils";

/** Matches the app `Sidebar` rail width (`w-[115px]`) for layout-aligned overlays. */
export const APP_SIDEBAR_WIDTH_PX = 115;

type Props = {
  handleClose: () => void;
  children?: ReactNode;
  headerText?: string;
  isSubmit?: boolean;
  Submitbutton?: () => void;
  classname?: string;
  disableRef?: boolean;
  disableSubmit?: boolean;
  isHeaderTextUnderline?: boolean;
  /** md+: dim and center only in the main column (right of the app sidebar). */
  containInMainColumn?: boolean;
  /** Smaller header, padding, and footer actions (e.g. PR flows). */
  compact?: boolean;
  /** Show a loading spinner on the submit button and disable it. */
  isLoading?: boolean;
};

const PopUp = ({
  handleClose,
  children,
  headerText,
  isSubmit,
  Submitbutton,
  classname,
  disableRef,
  disableSubmit,
  isHeaderTextUnderline,
  containInMainColumn,
  compact,
  isLoading,
}: Props) => {
  const DialogRef = useOutsideClick<HTMLDivElement>(handleClose);

  return (
    <div
      className={cn(
        "fixed z-50 flex items-center justify-center bg-black/20",
        containInMainColumn
          ? "inset-0 md:inset-y-0 md:right-0 md:left-[115px]"
          : "inset-0",
      )}
      style={{ margin: 0 }}
    >
      <div
        ref={!disableRef ? null : DialogRef}
        className={cn(
          `bg-white rounded-xl border w-full md:max-w-[700px] md:max-h-[500px] text-black font-light shadow-lg flex flex-col`,
          classname
        )}
      >
        <div
          className={cn(
            "flex justify-between items-center w-full flex-shrink-0",
            compact ? "p-3" : "p-4",
            isHeaderTextUnderline ? "border-b border-slate-200" : "",
          )}
        >
          <h1
            className={cn(
              compact
                ? "text-base font-semibold tracking-tight text-[#0F172A]"
                : "text-2xl font-poppins",
            )}
          >
            {headerText}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className={cn("cursor-pointer", compact && "h-8 w-8")}
            onClick={handleClose}
          >
            <X className={compact ? "h-4 w-4" : "h-6 w-6"} />
          </Button>
        </div>

        <div className={cn("overflow-y-auto flex-1", compact ? "px-3" : "px-4")}>
          {children}
        </div>

        <div
          className={cn(
            "flex justify-end items-center w-full flex-shrink-0 border-t bg-white",
            compact ? "gap-2 p-3" : "gap-3 p-4",
          )}
        >
          <Button
            className={cn(
              "whitespace-nowrap",
              compact ? "h-8 px-3 py-0 text-xs" : "py-2 px-4",
            )}
            variant={"backbtn"}
            size={"backbtnsize"}
            onClick={handleClose}
          >
            Back
          </Button>
          {isSubmit && (
            <Button
              disabled={disableSubmit || isLoading}
              className={cn(
                "whitespace-nowrap",
                compact ? "h-8 px-3 py-0 text-xs" : "py-2 px-4",
                (disableSubmit || isLoading) ? "opacity-50 cursor-not-allowed" : "",
              )}
              variant={"nextbtn"}
              size={"nextbtnsize"}
              onClick={() => {
                Submitbutton && Submitbutton();
              }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
