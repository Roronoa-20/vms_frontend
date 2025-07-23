"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface UserConfirmationButtonProps {
  po_no: string | null;
}

const UserConfirmationButton: React.FC<UserConfirmationButtonProps> = ({ po_no }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEmail("");
    setRemark("");
  };

  const handleSendEmail = () => {
    // Replace with actual API call, using pr_no, email, remark
    console.log("Send email for pr_no:", po_no);
    console.log("Email:", email);
    console.log("Remark:", remark);

    closeDialog();
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">User Confirmation</h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </label>

            <label className="block mb-4 text-sm font-medium text-gray-700">
              Remark:
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 resize-none"
                rows={3}
                placeholder="Enter your remark"
              />
            </label>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Close
              </button>

              <button
                onClick={handleSendEmail}
                disabled={!email}
                className={`px-4 py-2 rounded text-white ${
                  email ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
                }`}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserConfirmationButton;
