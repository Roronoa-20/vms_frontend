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
import { getQuickOnboardingRequesterRecords } from "@/src/services/quickVendor/quickVendor.services";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";

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

const DashboardMyVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  const [table, setTable] = useState<any[]>(dashboardTableData?.message?.data || []);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [search, setSearch] = useState<string>("");

  const [total_count, setTotalCount] = useState(dashboardTableData?.message?.total_count || 0);
  const [record_per_page, setRecordPerPage] = useState<number>(dashboardTableData?.message?.page_size || 5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const router = useRouter();
  const debouncedSearchName = useDebounce(search, 300);

  const user = Cookies.get("user_id");

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const fetchTable = async () => {
    try {
      const response = await getQuickOnboardingRequesterRecords({
        onboarding_id: search,
        status: "",
        company: selectedCompany,
        page_no: currentPage,
        page_size: record_per_page,
      });

      if (response?.message?.status === "success") {
        setTable(response.message.data || []);
        setTotalCount(response.message.total_count || 0);
      }
    } catch (error) {
      console.error("Error fetching my vendors table:", error);
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
            My Vendors
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search by ID..."
              value={search}
              onChange={handleSearchChange}
              className="w-64"
            />
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
              <TableHead className="w-[80px] text-center">Sr No.</TableHead>
              <TableHead>Onboarding ID</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Modified</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.length > 0 ? (
              table.map((item, index) => (
                <TableRow key={item.name} className="text-[13px]">
                  <TableCell className="text-center">
                    {(currentPage - 1) * record_per_page + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.vendor_name || "-"}</TableCell>
                  <TableCell>{item.company_code || "-"}</TableCell>
                  <TableCell className="text-gray-500">{item.email_requester}</TableCell>
                  <TableCell>{item.country || "-"}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-medium uppercase ${item?.approval_status?.toUpperCase().includes("PENDING")
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
                  <TableCell className="text-center text-gray-500">
                    {item.modified ? new Date(item.modified).toLocaleDateString() : "-"}
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
                <TableCell colSpan={9} className="text-center text-gray-500 py-10">
                  No vendors found.
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

export default DashboardMyVendorsTable;
