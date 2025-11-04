"use client";

import React, { useState, useEffect } from "react";
import MaterialRequestTable from "@/src/components/molecules/Material-Onboarding-Table/Material-Onboarding-CP-table";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { MaterialRequestItem } from "@/src/types/MaterialRequestTableTypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";

type Props = {
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const MaterialOnboarding: React.FC<Props> = ({ companyDropdown }) => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<MaterialRequestItem[]>([]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await requestWrapper({
        url: API_END_POINTS.getRequestorMasterTableList,
        method: "GET",
      });
      setAllData(response.data?.message?.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <div className="p-2 bg-slate-300">
      <MaterialRequestTable
        data={allData}
        companyDropdown={companyDropdown}
        TableTitle="Total Request"
      />
    </div>
  );
};

export default MaterialOnboarding;