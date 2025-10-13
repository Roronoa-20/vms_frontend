"use client";

import React from "react";
import UserRequestForm from "./user-request-form";

export default function MaterialInformationForm() {
  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
        <div className="space-y-2">
          <UserRequestForm />
        </div>
      </div>
    </div>
  );
}
