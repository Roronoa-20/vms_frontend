"use client";

import React, { useEffect, useState } from "react";
import MaterialRequestTable from "@/src/components/pages/new-material-code-request-table";
import {
  MaterialRequestItem,
  MaterialRequestListResponse,
  Pagination as PaginationType,
} from "@/src/types/MaterialRequestTableTypes";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown } from "@/src/types/types";

const MaterialRequestListPage: React.FC = () => {
  const [materialRequests, setMaterialRequests] = useState<MaterialRequestItem[]>([]);
  const [companyDropdown, setCompanyDropdown] = useState<TvendorRegistrationDropdown["message"]["data"]["company_master"]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total_count: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    has_previous: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch dropdown list
  const fetchCompanyDropdown = async () => {
    try {
      const dropdownUrl = API_END_POINTS.vendorRegistrationDropdown;
      const dropDownApi: AxiosResponse = await requestWrapper({
        url: dropdownUrl,
        method: "GET",
      });
      const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
        dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : "";
      setCompanyDropdown(dropdownData?.company_master || []);
    } catch (error) {
      console.error("Error fetching company dropdown:", error);
    }
  };

  // 🔹 Fetch table data
  const fetchMaterialRequestList = async (page = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * pagination.limit;

      const response: AxiosResponse<MaterialRequestListResponse> = await requestWrapper({
        method: "GET",
        url: `${API_END_POINTS.getRequestorMasterTableList}?limit=${pagination.limit}&offset=${offset}`,
      });

      const apiData = response?.data?.message;
      setMaterialRequests(apiData?.data || []);
      setPagination(apiData?.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching material requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDropdown();
    fetchMaterialRequestList(1);
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <MaterialRequestTable
          data={materialRequests}
          companyDropdown={companyDropdown}
        />
      )}
    </div>
  );
};

export default MaterialRequestListPage;
