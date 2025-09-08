"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QMSFormSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <Image
        src="/success-tick.gif"
        alt="Success Tick"
        width={75}
        height={75}
      />
      <h1 className="text-3xl font-bold mt-4 text-green-700">
        QMS Questionnaire Form Submitted Successfully!
      </h1>
      <p className="mt-2 text-gray-600">
        Thank you for your submission. Our Quality team will review it shortly.
      </p>
    </div>
  );
}
