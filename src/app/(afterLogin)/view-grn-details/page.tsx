import React from 'react';
import ViewGRNDetailsPage from '@/src/components/pages/viewGRNDetails';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  const grn_ref = params?.grn_ref ?? "";

  return <ViewGRNDetailsPage grn_ref={grn_ref} />;
}
