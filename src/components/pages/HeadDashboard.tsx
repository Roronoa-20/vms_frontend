import React from "react";
import HeadDashboardClient from "./HeadDashboardClient";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { cookies } from "next/headers";

const HeadDashboard = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const [accountsSAPError, accountsPending, accountsRejected, accountsApproved] = await Promise.all([
      requestWrapper({
        url: API_END_POINTS?.AccountsTeamSAPError,
        method: "GET",
        headers: { cookie: cookieHeaderString },
      }),
      requestWrapper({
        url: API_END_POINTS?.AccountsTeamPendingVendors,
        method: "GET",
        headers: { cookie: cookieHeaderString },
      }),
      requestWrapper({
        url: API_END_POINTS?.AccountsTeamRejectedVendors,
        method: "GET",
        headers: { cookie: cookieHeaderString },
      }),
      requestWrapper({
        url: API_END_POINTS?.AccountsTeamApprovedVendors,
        method: "GET",
        headers: { cookie: cookieHeaderString },
      }),
    ]);

    const apiResults = {
      accountsSAPError: {
        total_count: accountsSAPError?.data?.message?.total_count || 0,
        vendors: accountsSAPError?.data?.message?.accounts_team_sap_error || [],
      },
      accountsPending: {
        total_count: accountsPending?.data?.message?.total_count || 0,
        vendors: accountsPending?.data?.message?.accounts_team_pending || [],
      },
      accountsRejected: {
        total_count: accountsRejected?.data?.message?.total_count || 0,
        vendors: accountsRejected?.data?.message?.accounts_team_rejected || [],
      },
      accountsApproved: {
        total_count: accountsApproved?.data?.message?.total_count || 0,
        vendors: accountsApproved?.data?.message?.accounts_team_approved || [],
      },
    };

    return <HeadDashboardClient apiResults={apiResults} />;
  } catch (error) {
    console.error("HeadDashboard fetch error:", error);
    return <div className="p-4 text-red-600">Error loading Head Dashboard</div>;
  }
};


export default HeadDashboard;