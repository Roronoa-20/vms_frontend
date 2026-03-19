"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "../atoms/input";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Button } from "@/src/components/atoms/button";
import Cookies from "js-cookie";
import { getQuickOnboardingApprovalRecords } from "@/src/services/quickVendor/quickVendor.services";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";
import { useDashboardCardCountStore } from "@/src/store/DashboardCardCountStore";

type Props = {
  dashboardTableData: any;
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DashboardMyApprovalsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  const [table, setTable] = useState<any[]>(dashboardTableData?.message?.data || []);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [search, setSearch] = useState<string>("");

  const [total_count, setTotalCount] = useState(dashboardTableData?.message?.total_count || 0);
  const [record_per_page, setRecordPerPage] = useState<number>(dashboardTableData?.message?.page_size || 5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const { cardCounts, setCardCounts, updateCardCount } = useDashboardCardCountStore();

  const router = useRouter();
  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    fetchTable();
  }, [debouncedSearchName, selectedCompany, selectedStatus, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const fetchTable = async () => {
    try {
      const response = await getQuickOnboardingApprovalRecords({
        search_term: search,
        status: selectedStatus,
        company: selectedCompany,
        page_no: currentPage,
        page_size: record_per_page,
      });

      if (response?.message?.status === "success") {
        updateCardCount("my_approvals_count",response?.message?.total_count)
        setTable(response.message.data || []);
        setTotalCount(response.message.total_count || 0);
      }
    } catch (error) {
      console.error("Error fetching my approvals table:", error);
    }
  };

  const handleView = (can_edit: number, onboarding_id: string) => {
    let link = "";
    if (can_edit) {
      link = `/quick-vendor?onboarding_id=${onboarding_id}`;
    } else {
      link = `/view-quick-vendor?onboarding_id=${onboarding_id}`;
    }
    router.push(link);
  };

  return (
    <>
      <div className="shadow-sm bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4 items-center">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            My Approvals
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search by ID..."
              value={search}
              onChange={handleSearchChange}
              className="w-64"
            />
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => {
                setSelectedStatus(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={selectedCompany || "all"}
              onValueChange={(value) => {
                setSelectedCompany(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companyDropdown?.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE]">
              <TableHead className="text-left">#</TableHead>
              <TableHead className="text-left">Onboarding ID</TableHead>
              <TableHead className="text-left">Vendor Code</TableHead>
              <TableHead className="text-left">Vendor Name</TableHead>
              <TableHead className="text-left">Company</TableHead>
              <TableHead className="text-left">Requester</TableHead>
              <TableHead className="text-left">Country</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-left">Date</TableHead>
              <TableHead className="text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={item.name} className="text-[13px]">
                  <TableCell className="text-left">
                    {(currentPage - 1) * record_per_page + index + 1}
                  </TableCell>
                  <TableCell className="text-left font-medium">{item.name}</TableCell>
                  <TableCell className="text-left">{item.vendor_code || "-"}</TableCell>
                  <TableCell className="text-left">{item.vendor_name || "-"}</TableCell>
                  <TableCell className="text-left">{item.company || "-"}</TableCell>
                  <TableCell className="text-left text-gray-500">{item.requestor_name}</TableCell>
                  <TableCell className="text-left">{item.country || "-"}</TableCell>
                  <TableCell className="text-left">
                                      <span
                                        className={`px-3 py-1 rounded-full text-[12px] font-medium ${item?.approval_status?.toUpperCase().includes("PENDING")
                                          ? "bg-yellow-100 text-yellow-700"
                                          : item?.approval_status?.toUpperCase().includes("APPROVED")
                                            ? "bg-green-100 text-green-700"
                                            : item?.approval_status?.toUpperCase().includes("REJECTED")
                                              ? "bg-red-100 text-red-700"
                                              : ""
                                          }`}
                                      >
                                        {item.approval_status}
                                      </span>
                                    </TableCell>
                  <TableCell className="text-left text-gray-500">
                    {item.modified ?item.modified : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(item?.can_edit, item.name)}
                      className="bg-[#5291CD] text-white hover:bg-[#3d70a1] hover:text-white rounded-xl"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-left text-gray-500 py-10">
                  No approval records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        record_per_page={record_per_page}
        setCurrentPage={setCurrentPage}
        total_event_list={total_count}
      />
    </>
  );
};

export default DashboardMyApprovalsTable;
