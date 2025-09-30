"use client";
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
import { tableData } from "@/src/constants/dashboardTableData";
import { Input } from "../atoms/input";
import {
  DashboardTableType,
  TvendorRegistrationDropdown,
} from "@/src/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "./Pagination";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useAgingTimer } from "@/src/hooks/useAgingTimer";

type Props = {
  dashboardTableData: DashboardTableType;
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

const handleSelectChange = (
  value: string,
  setter: (val: string) => void
) => {
  if (value === "--Select--") {
    setter(""); // reset filter
  } else {
    setter(value);
  }
};


const DashboardPendingVendorsTable = ({ dashboardTableData, companyDropdown }: Props) => {
  console.log(dashboardTableData, "this is dashboardTableData");
  const [table, setTable] = useState<DashboardTableType["pending_vendor_onboarding"]>(dashboardTableData?.pending_vendor_onboarding);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();

  const user = Cookies?.get("user_id");
  console.log(user, "this is user");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage]);

  const handlesearchname = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(value, "this is search name");
    setSearch(value);
  };

  const fetchTable = async () => {
    const dashboardPendingVendorTableDataApi: AxiosResponse =
      await requestWrapper({
        url: `${API_END_POINTS?.dashboardPendingVendorTableURL}?usr=${user}&company=${selectedCompany}&vendor_name=${search}&page_no=${currentPage}`,
        method: "GET",
      });
    if (dashboardPendingVendorTableDataApi?.status == 200) {
      setTable(
        dashboardPendingVendorTableDataApi?.data?.message
          ?.pending_vendor_onboarding
      );
      settotalEventList(
        dashboardPendingVendorTableDataApi?.data?.message?.total_count
      );
      setRecordPerPage(5);
    }
  };

  console.log(table, "this is table");
  const { designation } = useAuth();
  const isAccountsUser = designation?.toLowerCase().includes("account");
  const isTreasuryUser = designation?.toLowerCase() === "treasury";

  const handleView = async (refno: string, vendor_Onboarding: string) => {
    router.push(
      `/view-onboarding-details?tabtype=${isTreasuryUser ? "Document Detail" : "Company Detail"
      }&vendor_onboarding=${vendor_Onboarding}&refno=${refno}`
    );
  };

  const AgingCell = ({ timeDiff }: { timeDiff?: string }) => {
    const aging = useAgingTimer(timeDiff || "");
    return <div>{timeDiff ? aging : "--"}</div>;
  };

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Total Pending Vendors
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search..."
              onChange={(e) => {
                handlesearchname(e);
              }}
            />
            <Select
              value={selectedCompany}
              onValueChange={(value) => handleSelectChange(value, setSelectedCompany)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  <SelectItem value="--Select--">--Select--</SelectItem>
                  {companyDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>
                      {item?.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">Ref No.</TableHead>
              <TableHead className="text-center text-black">
                Vendor Name
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Company Code
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Registered By
              </TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Aging
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Purchase Team
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Purchase Head
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                Account Team
              </TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">
                View Details
              </TableHead>
              {!isAccountsUser && !isTreasuryUser && (
                <TableHead className="text-center text-black whitespace-nowrap">
                  QMS Form
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {table ? (
              table.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * record_per_page + index + 1}
                  </TableCell>
                  <TableCell className="text-nowrap">{item?.ref_no}</TableCell>
                  <TableCell className="text-nowrap">
                    {item?.vendor_name}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {item?.company_name}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {item?.registered_by_full_name}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-3 rounded-xl uppercase ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item?.onboarding_form_status || "--"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="px-2 py-3 rounded-[20px] bg-blue-200 text-orange-800 text-[14px] font-medium">
                      {" "}
                      <AgingCell timeDiff={item?.time_diff} />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {item?.purchase_t_approval_full_name || "--"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {item?.purchase_h_approval_full_name || "--"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {item?.accounts_t_approval_full_name || "--"}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-400 hover:bg-blue-300"
                      onClick={() => {
                        item?.form_fully_submitted_by_vendor == 1
                          ? handleView(item?.ref_no, item?.name)
                          : alert("Vendor Form is not Fully Submitted!!!");
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                  {!isAccountsUser && !isTreasuryUser && (
                    <TableCell>
                      <div
                        className={`${item?.qms_form_filled && item?.sent_qms_form_link && (item?.company_name == "2000" || item?.company_name == "7000") ? "" : "hidden"}`}
                      >
                        <Link
                          href={`/qms-form-details?tabtype=vendor_information&vendor_onboarding=${item?.name}&ref_no=${item?.ref_no}&company_code=${item?.company_name}`}
                        >
                          <Button className="bg-blue-400 hover:bg-blue-300">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-gray-500 py-4"
                >
                  No results found
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
        total_event_list={total_event_list}
      />
    </>
  );
};

export default DashboardPendingVendorsTable;
