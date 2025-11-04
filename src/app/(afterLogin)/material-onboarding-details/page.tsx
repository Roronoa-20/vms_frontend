import MaterialOnboardingDetails from "@/src/components/pages/material-onboarding-details";
import React from "react";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  return <MaterialOnboardingDetails searchParams={searchParams} />;
}
