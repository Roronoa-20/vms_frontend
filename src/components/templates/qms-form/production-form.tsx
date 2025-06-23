'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export const ProductionForm = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">QAS Form</h2>
      <p><strong>Form ID:</strong> {vendor_onboarding}</p>
      {/* TODO: Add QAS form fields */}
    </div>
  );
};
