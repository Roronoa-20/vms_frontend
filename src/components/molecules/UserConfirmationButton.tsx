"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { PencilIcon } from "lucide-react";

interface UserConfirmationButtonProps {
  po_no: string | null;
  poDetails: any | null;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserConfirmationButton: React.FC<UserConfirmationButtonProps> = ({
  po_no,
  poDetails,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const po_id = poDetails?.name || "";
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAutoPopulated, setIsAutoPopulated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDialogOpen) {
      const initialEmail = poDetails?.requisitioner_email || "";
      setEmail(initialEmail);
      setIsAutoPopulated(Boolean(initialEmail));
    } else {
      setEmail("");
      setRemark("");
      setIsAutoPopulated(false);
    }
  }, [isDialogOpen, poDetails]);

  const isEmailValid = emailRegex.test(email);

  const handleClearEmail = () => {
    setEmail("");
    setIsAutoPopulated(false);
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleSendEmail = async () => {
    if (!po_id) {
      alert("PO ID is missing.");
      return;
    }
    if (!isEmailValid) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      const url = `${API_END_POINTS?.senduserconfirmationemail}`;
      const response: AxiosResponse = await requestWrapper({
        url,
        method: "POST",
        data: {
          po_id,
          remark,
          email,
        },
      });
      console.log("PO Response--->", response);
      if (response?.status === 200) {
        setIsSuccessModalOpen(true);
      }
    } catch (e) {
      console.error("Send email error", e);
    }
  };

  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false);
    closeDialog();
    router.push("/view-grn");
  };

  return (
    <>
      <Button
        onClick={openDialog}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[8px]"
        variant="nextbtn"
        size="nextbtnsize"
      >
        User Confirmation
      </Button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h3 className="text-lg font-semibold mb-4">User Confirmation</h3>

            <Label className="block mb-2 text-sm font-medium text-gray-700 relative">
              Enter Email:
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsAutoPopulated(false);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 pr-10"
                  placeholder="you@example.com"
                />
                {isAutoPopulated && email && (
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                    onClick={handleClearEmail}
                  />
                )}
              </div>
            </Label>

            <Label className="block mb-4 text-sm font-medium text-gray-700">
              Remark:
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 resize-none"
                rows={3}
                placeholder="Enter your remark"
              />
            </Label>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeDialog}
                className="py-2.5"
                variant="backbtn"
                size="backbtnsize"
              >
                Close
              </Button>

              <Button
                onClick={handleSendEmail}
                disabled={!email || !isEmailValid}
                className={`px-4 py-2.5 text-white ${
                  email && isEmailValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-300 cursor-not-allowed"
                }`}
                variant="nextbtn"
                size="nextbtnsize"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Success</h3>
            <p className="mb-6">Email Sent to User for Confirmation</p>
            <Button
              onClick={handleSuccessOk}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserConfirmationButton;


// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import API_END_POINTS from "@/src/services/apiEndPoints";
// import { AxiosResponse } from "axios";
// import requestWrapper from "@/src/services/apiCall";

// interface UserConfirmationButtonProps {
//   po_no: string | null;
//   poDetails: any | null;
// }

// const UserConfirmationButton: React.FC<UserConfirmationButtonProps> = ({ po_no, poDetails }) => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [remark, setRemark] = useState("");
//   const po_id = poDetails?.name || "";
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//   const router = useRouter();

//   const openDialog = () => setIsDialogOpen(true);
//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setEmail("");
//     setRemark("");
//   };

//   const handleSendEmail = async () => {
//     if (!po_id) {
//       alert("PO ID is missing.");
//       return;
//     }
//     try {
//       const url = `${API_END_POINTS?.senduserconfirmationemail}`;
//       console.log(url)
//       const response: AxiosResponse = await requestWrapper({
//         url,
//         method: "POST",
//         data: {
//           po_id,
//           remark,
//           // email,
//         },
//       });
//       console.log("PO Response--->", response);
//       if (response?.status === 200) {
//         setIsSuccessModalOpen(true);
//       }
//     } catch (e) {
//       console.error("Send email error", e);
//     }
//   };

//   const handleSuccessOk = () => {
//     setIsSuccessModalOpen(false);
//     closeDialog();
//     router.push("/view-grn");
//   };

//   return (
//     <>
//       <Button
//         onClick={openDialog}
//         className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[8px]"
//         variant="nextbtn"
//         size="nextbtnsize"
//       >
//         User Confirmation
//       </Button>

//       {isDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//             <h3 className="text-lg font-semibold mb-4">User Confirmation</h3>

//             <Label className="block mb-2 text-sm font-medium text-gray-700">
//               Enter Email:
//               <Input
//                 type="email"
//                 value={poDetails.requisitioner_email || ""}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
//                 placeholder="you@example.com"
//               />
//             </Label>

//             <Label className="block mb-4 text-sm font-medium text-gray-700">
//               Remark:
//               <textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 resize-none"
//                 rows={3}
//                 placeholder="Enter your remark"
//               />
//             </Label>

//             <div className="flex justify-end space-x-3">
//               <Button
//                 onClick={closeDialog}
//                 className="py-2.5"
//                 variant="backbtn"
//                 size="backbtnsize"
//               >
//                 Close
//               </Button>

//               <Button
//                 onClick={handleSendEmail}
//                 disabled={!email}
//                 className={`px-4 py-2.5 text-white ${email ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
//                   }`}
//                   variant="nextbtn"
//                   size="nextbtnsize"
//               >
//                 Send Email
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Success Modal */}
//       {isSuccessModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
//             <h3 className="text-lg font-semibold mb-4">Success</h3>
//             <p className="mb-6">Email Sent to User for Confirmation</p>
//             <Button onClick={handleSuccessOk} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
//               OK
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserConfirmationButton;
