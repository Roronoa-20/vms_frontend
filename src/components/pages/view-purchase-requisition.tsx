'use client';

import React, { useEffect, useState } from 'react';
import ViewPRTable from '@/src/components/templates/ViewPRTable';
import API_END_POINTS from '@/src/services/apiEndPoints';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequisitionDataItem } from '@/src/types/PurchaseRequisitionType';
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { AxiosResponse } from "axios";

const ViewPurchaseRequisitionPage = () => {
  const [prData, setPrData] = useState<PurchaseRequisitionDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageLength = 10;

  const fetchDropdown = async () => {
    try {
      const dropDownApi: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.vendorRegistrationDropdown,
        method: "GET",
      });

      const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
        dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : "";

      return dropdownData?.company_master || [];
    } catch (err) {
      console.error("Error fetching dropdown:", err);
      return [];
    }
  };

  const fetchPRData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await requestWrapper({
        url: `${API_END_POINTS.sapprcreated}?page_no=${page}&page_length=${pageLength}`,
        method: 'GET',
      });

      if (response?.status === 200) {
        const msg = response?.data?.message;
        setPrData(msg?.data || []);
        setTotalCount(msg?.total_count || 0);
      } else {
        console.error('Failed to fetch PR data.');
      }
    } catch (error) {
      console.error('Error fetching PR data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdown();
    fetchPRData(pageNo);
  }, [pageNo]);

  return (
    <div className="p-4">
      <ViewPRTable
        data={prData}
        loading={loading}
        pageNo={pageNo}
        pageLength={pageLength}
        totalCount={totalCount}
        onPageChange={setPageNo}
      
      />
    </div>
  );
};

export default ViewPurchaseRequisitionPage;
