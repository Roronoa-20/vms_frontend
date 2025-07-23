// 'use client';

// import React, { useEffect, useState } from 'react';
// import ViewPRTable from '@/src/components/templates/ViewPRTable'; 
// import API_END_POINTS from '@/src/services/apiEndPoints';
// import requestWrapper from '@/src/services/apiCall';
// import {
//   PurchaseRequisitionResponse,
//   PurchaseRequisitionDataItem,
//   CompanyInfo,
//   SubheadField
// } from '@/src/types/PurchaseRequisitionType';

// const ViewPurchaseRequisitionPage = () => {
//   const [prData, setPrData] = useState<PurchaseRequisitionDataItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPRData = async () => {
//     try {
//       const response = await requestWrapper({
//         url: API_END_POINTS.AllPRDetails,
//         method: 'GET',
//       });
//       console.log("API response:",response)
//       if (response?.status === 200) {
//         setPrData(response?.data?.message?.total_pr || []);
//       } else {
//         console.error('Failed to fetch PR data.');
//       }
//     } catch (error) {
//       console.error('Error fetching PR data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPRData();
//   }, []);

//   return (
//     <div className="p-4">
//       <ViewPRTable data={prData} loading={loading} />
//     </div>
//   );
// };

// export default ViewPurchaseRequisitionPage;

'use client';

import React, { useEffect, useState } from 'react';
import ViewPRTable from '@/src/components/templates/ViewPRTable';
import API_END_POINTS from '@/src/services/apiEndPoints';
import requestWrapper from '@/src/services/apiCall';
import { PurchaseRequisitionDataItem } from '@/src/types/PurchaseRequisitionType';

const ViewPurchaseRequisitionPage = () => {
  const [prData, setPrData] = useState<PurchaseRequisitionDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageLength = 5; // Can be dynamic if needed

  const fetchPRData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await requestWrapper({
        url: `${API_END_POINTS.AllPRDetails}?page_no=${page}&page_length=${pageLength}`,
        method: 'GET',
      });

      if (response?.status === 200) {
        const msg = response?.data?.message;
        setPrData(msg?.total_pr || []);
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
