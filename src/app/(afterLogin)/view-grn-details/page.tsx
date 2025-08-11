'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ViewGRNDetails from '@/src/components/templates/ViewGRNDetails';
import requestWrapper from '@/src/services/apiCall';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { GRNForm } from '@/src/types/grntypes';

const ViewGRNDetailPage = () => {
  const params = useSearchParams();
  const grn_ref = params.get('grn_ref') || '';
  const [data, setData] = useState<GRNForm | null>(null);

  useEffect(() => {
    if (!grn_ref) return;

    const fetchData = async () => {
      try {
        const response = await requestWrapper({
          url: `${API_END_POINTS.SingleGRNdetails}?grn_number=${grn_ref}`,
          method: 'GET',
        });

        const result: GRNForm = response?.data?.message;
        console.log('GRN Data:', result);
        setData(result);
      } catch (err) {
        console.error('Failed to fetch GRN details:', err);
      }
    };

    fetchData();
  }, [grn_ref]);

  return data ? (
    <ViewGRNDetails grn={data} />
  ) : (
    <div className="p-4 text-center">Loading GRN Details...</div>
  );
};

export default ViewGRNDetailPage;
