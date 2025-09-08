"use client";

import React from 'react';
import VendorDashboardCardCounter from "../molecules/Vendor-Dashboard-Card-Count";
import { dashboardCardData, VendorDashboardPOTableData } from '@/src/types/types';

interface VendorDashboardClientProps {
  companyDropdown: any[];
  cardData: dashboardCardData;
  dashboardPOTableData: VendorDashboardPOTableData["message"];
  dispatchTableData: any[];
  dispatchCardCount: number;
}

const VendorDashboardClient: React.FC<VendorDashboardClientProps> = ({
  companyDropdown,
  cardData,
  dashboardPOTableData,
  dispatchTableData,
  dispatchCardCount,
}) => {
  return (
    <div className="p-4">
      <VendorDashboardCardCounter
        companyDropdown={companyDropdown}
        cardData={cardData}
        dashboardPOTableData={dashboardPOTableData}
        dispatchTableData={dispatchTableData}
        dispatchCardCount={dispatchCardCount}
      />
    </div>
  );
};

export default VendorDashboardClient;
