"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialRequestItem, Pagination as PaginationType, MaterialRequestChildItem } from "@/src/types/MaterialRequestTableTypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import Pagination from "../molecules/Pagination";
import { Button } from "@/components/ui/button";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/select";
import Link from "next/link";

interface MaterialRequestTableProps {
  data: MaterialRequestItem[];
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
}

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const MaterialRequestTable: React.FC<MaterialRequestTableProps> = ({ data = [], companyDropdown }) => {
  const [table, setTable] = useState<MaterialRequestItem[]>(data);
  const [search, setSearch] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationType>({
    total_count: 0,
    limit: 15,
    offset: 0,
    has_next: false,
    has_previous: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchName, selectedCompany, selectedStatus]);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, selectedStatus, currentPage]);

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Flatten parent-child data
  const flattenedData: (MaterialRequestChildItem & {
    requestor_ref_no: string;
    request_date: string;
    approval_status: string;
  })[] = table.flatMap((parent) =>
    parent.material_request_items?.map((child) => ({
      ...child,
      requestor_ref_no: parent.name,
      request_date: parent.request_date,
      approval_status: parent.approval_status,
      request_id: parent.request_id,
      company_name: child.company_name || parent.requestor_company || "-"
    })) || []
  );


  const fetchTable = async () => {
    try {
      setLoading(true);

      const filters: Record<string, any> = {};
      if (selectedCompany) filters["company_name"] = selectedCompany;
      if (selectedStatus) filters["approval_status"] = selectedStatus;

      const offset = (currentPage - 1) * pagination.limit;

      let url = `${API_END_POINTS.getRequestorMasterTableList}?limit=${pagination.limit}&offset=${offset}`;

      if (debouncedSearchName) {
        url += `&search_term=${encodeURIComponent(debouncedSearchName)}`;
      }

      if (Object.keys(filters).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
      }

      url += `&_t=${Date.now()}`;

      const materialrequestAPI: AxiosResponse = await requestWrapper({ url, method: "GET" });

      if (materialrequestAPI?.status === 200) {
        const resData = materialrequestAPI.data?.message;
        setTable(resData?.data || []);
        setPagination((prev) => ({
          ...prev,
          total_count: resData?.pagination?.total_count || resData?.total_count || 0,
          has_next: resData?.pagination?.has_next || false,
          has_previous: resData?.pagination?.has_previous || false,
        }));
      }
    } catch (error) {
      console.error("Error fetching material request table:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRecords = pagination.total_count;
  const recordsPerPage = pagination.limit;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.trim().split(" ")[0];
    if (!cleanDate) return "-";
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "-";
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-md p-4 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3 md:gap-0">
        {/* Left side: Button */}
        <div className="flex-shrink-0">
          <a
            href="/material-code-request-form"
            rel="noopener noreferrer"
            className="bg-[#7298e5] text-white text-sm font-medium px-4 py-2 rounded-[24px] hover:bg-[#003b91] transition duration-200 inline-flex items-center"
          >
            <Plus size={24} className="mr-2" />
            Onboard New Material
          </a>
        </div>

        {/* Right side: Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 md:mt-0">
          <Input
            type="text"
            placeholder="Search by Material Description..."
            value={search}
            onChange={handleSearchName}
            className="border px-3 py-2 rounded-md text-sm w-full sm:w-[250px]"
          />
          <Select
            value={selectedCompany || "all"}
            onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Company</SelectItem>
                {companyDropdown?.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.description}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) => setSelectedStatus(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending by CP">Pending by CP</SelectItem>
                <SelectItem value="Sent to SAP">Sent to SAP</SelectItem>
                <SelectItem value="Code Generated by SAP">Code Generated by SAP</SelectItem>
                <SelectItem value="SAP Error">SAP Error</SelectItem>
                <SelectItem value="Use Existing Code">Use Existing Code</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black whitespace-nowrap">Sr.No.</TableHead>
              {/* <TableHead className="text-center text-black whitespace-nowrap">Requestor Ref No</TableHead> */}
              <TableHead className="text-center text-black whitespace-nowrap">Request ID</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Request Date</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Company</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Plant Name</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Material Type</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Material Description</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">Status</TableHead>
              <TableHead className="text-center text-black whitespace-nowrap">View Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {flattenedData.length > 0 ? (
              flattenedData.map((item, index) => (
                <TableRow key={item.child_name || index}>
                  <TableCell className="text-center whitespace-nowrap">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item.request_id}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{formatDate(item.request_date)}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item.company_name}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item.plant || "-"}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item.material_type}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{item.material_description}</TableCell>
                  <TableCell>
                    <p
                      className={`rounded-[10px] text-[14px] font-medium text-center text-nowrap py-[7px] mx-auto ${item.approval_status === "Code Generated by SAP" ? "w-[180px]" : "w-[150px]"}
                                                                                        ${["Approved by CP", "Code Generated by SAP", "Sent to SAP"].includes(item.approval_status)
                          ? "bg-green-100 text-green-800"
                          : item.approval_status === "SAP Error"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {item.approval_status || "Pending"}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/material-code-request-form?name=${encodeURIComponent(
                        item.requestor_ref_no
                      )}&material_name=${encodeURIComponent(item.child_name)}`}
                      className="inline-block"
                    >
                      <Button className="bg-[#5291CD] rounded-[16px] hover:bg-white hover:text-black">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-6">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total_event_list={totalRecords}
          record_per_page={recordsPerPage}
        />
      </div>
    </div>
  );
};

export default MaterialRequestTable;
