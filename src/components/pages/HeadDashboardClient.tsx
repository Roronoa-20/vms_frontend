"use client";

import React from 'react';
import HeadDashboardCardCounter from "../molecules/Head-Dashboard-Card-Count";
import { dashboardCardData, VendorDashboardPOTableData, RFQTable} from '@/src/types/types';

interface VendorDashboardClientProps {
  companyDropdown: any[];
  cardData: dashboardCardData;
  dashboardPOTableData: VendorDashboardPOTableData["message"];
  dispatchTableData: any[];
  dispatchCardCount: number;
  rfqData: RFQTable
}

const HeadDashboardClient: React.FC<VendorDashboardClientProps> = ({
  companyDropdown,
  cardData,
  dashboardPOTableData,
  dispatchTableData,
  dispatchCardCount,
  rfqData
}) => {
  return (
    <div className="p-4">
      <HeadDashboardCardCounter
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

export default HeadDashboardClient;
