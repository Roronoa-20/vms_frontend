"use client";

import React, { useState, useEffect } from "react";
import MaterialRequestTable from "@/src/components/molecules/Material-Onboarding-Table/Material-Onboarding-CP-table";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { MaterialRequestItem, TableFilters } from "@/src/types/MaterialRequestTableTypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";

type Props = {
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const MaterialOnboarding: React.FC<Props> = ({ companyDropdown }) => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<MaterialRequestItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<TableFilters>({});
  const recordPerPage = 20;

  const fetchTableData = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const offset = (page - 1) * recordPerPage;
      const { search, ...restFilters } = currentFilters;
      
      // Clean filters: remove empty strings, null, undefined
      const cleanFilters = Object.fromEntries(
        Object.entries(restFilters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      let url = `${API_END_POINTS.getRequestorMasterTableList}?limit=${recordPerPage}&offset=${offset}`;

      if (search) {
        url += `&search_term=${encodeURIComponent(search)}`;
      }

      if (Object.keys(cleanFilters).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(cleanFilters))}`;
      }

      url += `&_t=${Date.now()}`;

      const response = await requestWrapper({
        url: url,
        method: "GET",
      });
      
      const apiData = response.data?.message;
      setAllData(apiData?.data || []);
      setTotalRecords(apiData?.pagination?.total_count || apiData?.total_count || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(1);
  }, []);

  const handleFilterChange = (newFilters: TableFilters) => {
    setFilters(newFilters);
    fetchTableData(1, newFilters);
  };

  return (
    <div className="p-2 bg-slate-300">
      <MaterialRequestTable
        data={allData}
        companyDropdown={companyDropdown}
        TableTitle="Total Request"
        currentPage={currentPage}
        setCurrentPage={fetchTableData}
        totalRecords={totalRecords}
        recordPerPage={recordPerPage}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default MaterialOnboarding;