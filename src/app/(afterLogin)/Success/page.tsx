"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const AcceptedSuccessPopup: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#EBEBF6] z-50 text-black">
      <Card className="max-w-md w-full bg-white shadow-lg rounded-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the form. Your response has been recorded successfully.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptedSuccessPopup;
