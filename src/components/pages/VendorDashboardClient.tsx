"use client";

import React from 'react';
import VendorDashboardCardCounter from "../molecules/Vendor-Dashboard-Card-Count";
import { dashboardCardData, VendorDashboardPOTableData, RFQTable} from '@/src/types/types';

interface VendorDashboardClientProps {
  companyDropdown: any[];
  cardData: dashboardCardData;
  dashboardPOTableData: VendorDashboardPOTableData["message"];
  dispatchTableData: any[];
  dispatchCardCount: number;
  rfqData: RFQTable
}

const VendorDashboardClient: React.FC<VendorDashboardClientProps> = ({
  companyDropdown,
  cardData,
  dashboardPOTableData,
  dispatchTableData,
  dispatchCardCount,
  rfqData
}) => {
  return (
    <div className="p-3">
      <VendorDashboardCardCounter
        companyDropdown={companyDropdown}
        cardData={cardData}
        dashboardPOTableData={dashboardPOTableData}
        dispatchTableData={dispatchTableData}
        dispatchCardCount={dispatchCardCount}
        rfqData={rfqData}
      />
    </div>
  );
};

export default VendorDashboardClient;
