"use client";

import React from "react";
import HeadDashboardCardCounter from "../molecules/Head-Dashboard-Card-Count";

interface VendorData {
  total_count: number;
  vendors: any[];
}

interface HeadDashboardClientProps {
  apiResults: {
    accountsSAPError: VendorData;
    accountsPending: VendorData;
    accountsRejected: VendorData;
    accountsApproved: VendorData;
  };
}

const HeadDashboardClient: React.FC<HeadDashboardClientProps> = ({ apiResults }) => {
  return (
    <div className="p-4">
      <HeadDashboardCardCounter apiResults={apiResults} />
    </div>
  );
};

export default HeadDashboardClient;
