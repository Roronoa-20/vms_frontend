"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "../atoms/select";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import Pagination from "../molecules/Pagination";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { MaterialCodeResponse, MaterialCode } from "@/src/types/MaterialCodeRequestFormTypes";

type Props = {
  loading: boolean;
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
  data: MaterialCodeResponse;
  allowedCompanyCodes?: string[];
  isMaterialUser?: boolean;
};

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ViewMaterialCodeTable = ({ data, loading, companyDropdown, allowedCompanyCodes, isMaterialUser }: Props) => {
  // console.log("Allowed Company Code in Material Code Data----->", allowedCompanyCodes)
  const [table, setTable] = useState<MaterialCode[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [materialtype, setMaterialType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, materialtype, currentPage]);

  const fetchTable = async () => {
    setIsFetching(true);
    try {
      const filters: any = {};
      if (selectedCompany) {
        filters.company = selectedCompany;
      } else if (isMaterialUser && allowedCompanyCodes?.length) {
        filters.company = ["in", allowedCompanyCodes];
      }

      const url =
        `${API_END_POINTS.MaterialCodeSearchApi}` +
        `?filters=${encodeURIComponent(JSON.stringify(filters))}` +
        `&search_term=${encodeURIComponent(debouncedSearchName)}` +
        `&page_no=${currentPage}&page_length=${record_per_page}`;

      const res = await requestWrapper({ url, method: "GET" });

      if (res?.status === 200) {
        const message = res?.data?.message;
        setTable(message?.data || []);
        settotalEventList(message?.pagination?.total_count || 0);
      }
    } finally {
      setIsFetching(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading material data...</p>;

  return (
    <>
      <div className="shadow bg-[#f6f6f7] p-3 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Search Material Code / Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[200px]"
          />
          <Select
            value={selectedCompany || "all"}
            onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {isMaterialUser && allowedCompanyCodes ? (
                  allowedCompanyCodes.map((code, index) => {
                    const company = companyDropdown?.find(c => c.name === code);
                    return (
                      <SelectItem key={index} value={code}>
                        {company ? company.description : code}
                      </SelectItem>
                    );
                  })
                ) : (
                  companyDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>
                      {item?.description}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="text-center text-black sticky left-0 z-20 bg-blue-100 w-[60px] min-w-[60px]">Sr No.</TableHead>
              <TableHead className="text-center text-black sticky left-[60px] z-20 bg-blue-100 w-[150px] min-w-[150px]">Company</TableHead>
              <TableHead className="text-center text-black sticky left-[210px] z-20 bg-blue-100 w-[150px] min-w-[150px]">Material Code</TableHead>
              <TableHead className="text-center text-black sticky left-[360px] z-20 bg-blue-100 w-[300px] min-w-[300px] border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Material Description</TableHead>
              <TableHead className="text-center text-black min-w-[150px]">Material Type</TableHead>
              <TableHead className="text-center text-black min-w-[150px]">Plant</TableHead>
              <TableHead className="text-center text-black min-w-[150px]">Material Group</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Loading material codes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              table.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center sticky left-0 z-10 bg-white w-[60px] min-w-[60px]">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center sticky left-[60px] z-10 bg-white w-[150px] min-w-[150px]">{row.company}</TableCell>
                  <TableCell className="text-center text-nowrap sticky left-[210px] z-10 bg-white w-[150px] min-w-[150px]">{row.material_code}</TableCell>
                  <TableCell className="text-center sticky left-[360px] z-10 bg-white w-[300px] min-w-[300px] border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.material_description}</TableCell>
                  <TableCell className="text-center text-nowrap min-w-[150px]">{row.material_type}</TableCell>
                  <TableCell className="text-center text-nowrap min-w-[150px]">{row.plant_description}</TableCell>
                  <TableCell className="text-center text-nowrap min-w-[150px]">{row.material_group_new_description}</TableCell>
                </TableRow>
              ))
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

export default ViewMaterialCodeTable;
