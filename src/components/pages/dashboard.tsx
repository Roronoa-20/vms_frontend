// app/(whatever)/dashboard/page.tsx

import DashboardCardCounter from "../molecules/Dashboard-Card-Count";
import { fetchDashboardData } from "@/src/app/(afterLogin)/dashboard/fetchData";

const Dashboard = async () => {
  const data = await fetchDashboardData();

  return (
    <div className="p-4">
      <DashboardCardCounter
        cardData={data.cardData}
        companyDropdown={data.companyDropdown}
        filterregisteredby={data.filterregisteredby}
        dashboardPOTableData={data.poTableData}
        dashboardTotalVendorTableData={data.totalVendorTable}
        dashboardPendingVendorTableData={data.pendingVendorTable}
        dashboardApprovedVendorTableData={data.approvedVendorTable}
        dashboardRejectedVendorTableData={data.rejectedVendorTable}
        prInquiryData={data.prInquiryData}
        prData={data.prData}
        rfqData={data.rfqData}
        dashboardASAFormTableData={data.asaFormData}
        dashboardASAPendingVendorListTableData={data.asaPendingList}
        sapErrorDashboardData={data.sapErrorDashboardData}
        dashboardAccountsPending={data.accountsPending}
        dashboardAccountsOnboarded={data.accountsOnboarded}
        dashboardAccountsRejected={data.accountsRejected}
        dashboardAccountsSapErrors={data.accountsSapErrors}
        ASAdashboardOnboardedVendorListTableData={data.asaOnboardedList}
      />
    </div>
  );
};

export default Dashboard;
