import React, { Suspense } from "react";
import ViewPOforUSerConfirmation from "@/src/components/pages/ViewPOforUSerConfirmation";

const page = () => {
  return (
    <Suspense fallback={<div>Loading PO Details...</div>}>
      <ViewPOforUSerConfirmation />
    </Suspense>
  );
};

export default page;