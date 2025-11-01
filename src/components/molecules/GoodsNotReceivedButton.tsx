"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface GoodsNotReceivedButtonProps {
  po_no: string | null;
  poDetails: any | null;
}

const GoodsNotReceivedButton: React.FC<GoodsNotReceivedButtonProps> = ({ po_no, poDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const po_id = poDetails?.name || "";

  const handleSend = async () => {
    if (!po_id) {
      alert("Missing PO ID");
      return;
    }
    try {
      const url = `${API_END_POINTS?.sendvendoremailonuser}`;
      const response: AxiosResponse = await requestWrapper({
        url,
        method: "POST",
        data: {
          po_id,
          remark,
        },
      });
      console.log("Goods Not Received Response:", response);
      if (response.status === 200) {
        setIsSuccess(true);
        setSuccessMessage("Email Sent for Goods Not Received to Vendor!!!");
      }
    } catch (err) {
      console.error("Error sending goods not received email", err);
    }
  };

  return (
    <>
      <Button
        variant="nextbtn"
        size="nextbtnsize"
        className="px-4 py-2 hover:bg-white hover:text-black hover:border border-[#5291CD] rounded-[8px]"
        onClick={() => setIsOpen(true)}
      >
        Goods Not Received
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Goods Not Received</h3>
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
              <Button onClick={handleSend} variant="nextbtn" size="nextbtnsize">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          {/* <div className="bg-white p-6 rounded text-center">
              <p>Email Sent for Goods Not Received</p>
              <Button onClick={() => { setIsSuccess(false); setIsOpen(false); }} className="mt-4 py-2.5" variant="nextbtn" size="nextbtnsize">
                OK
              </Button>
            </div> */}
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <Card className="bg-white p-6 w-[400px] text-center rounded-lg shadow-lg">
              <CardContent className="p-8 text-center bg-gradient-to-b from-white to-gray-50 rounded-2xl">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Success</h2>
                <p className="text-sm text-gray-600">{successMessage}</p>
                <Button
                  className="mt-2"
                  variant="nextbtn"
                  size="nextbtnsize"
                  onClick={() => { setIsSuccess(false); setIsOpen(false); window.location.reload(); }}
                >
                  OK
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default GoodsNotReceivedButton;