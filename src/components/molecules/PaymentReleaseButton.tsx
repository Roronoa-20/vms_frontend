"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

interface PaymentReleaseButtonProps {
  po_no: string | null;
  poDetails: any | null;
}

const PaymentReleaseButton: React.FC<PaymentReleaseButtonProps> = ({ po_no, poDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const po_id = poDetails?.name || "";

  const handleSend = async () => {
    if (!po_id) return alert("Missing PO ID");
    try {
      const url = `${API_END_POINTS?.sendaccountsteamemailuserconf}`;
      const response: AxiosResponse = await requestWrapper({
        url,
        method: "POST",
        data: {
          po_id,
          remark,
        },
      });
      console.log("Payment Release Response:", response);
      if (response.status === 200) setIsSuccess(true);
    } catch (err) {
      console.error("Error sending payment release email", err);
    }
  };

  return (
    <>
      <Button
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-[8px]"
        onClick={() => setIsOpen(true)}
      >
        Payment Release
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Payment Release</h3>
            <Label className="block mb-2 text-sm font-medium">Remark:</Label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter remark"
              rows={3}
            />

            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsOpen(false)} variant="backbtn" size="backbtnsize">
                Cancel
              </Button>
              <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700 text-white">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded text-center">
            <p>Email Sent for Payment Release</p>
            <Button onClick={() => { setIsSuccess(false); setIsOpen(false); }} className="mt-4 py-2.5" variant="nextbtn" size="nextbtnsize">
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentReleaseButton;
