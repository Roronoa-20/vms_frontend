"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
};

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ViewMaterialCodeTable = ({ data, loading, companyDropdown }: Props) => {
  console.log("THis Material Code Data----->", data)
  const [table, setTable] = useState<MaterialCode[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [materialtype, setMaterialType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, materialtype, currentPage]);

  const fetchTable = async () => {
    const filters: any = {};

    if (selectedCompany) {
      filters.company = selectedCompany;
    }

    const url =
      `${API_END_POINTS.MaterialCodeSearchApi}` +
      `?filters=${encodeURIComponent(JSON.stringify(filters))}` +
      `&search_term=${encodeURIComponent(debouncedSearchName)}` +
      `&page_no=${currentPage}&page_length=${record_per_page}`;

    const res = await requestWrapper({ url, method: "GET" });

    console.log("API RAW RESPONSE:", res);

    if (res?.status === 200) {
      const message = res?.data?.message;

      console.log("TABLE DATA:", message?.data);

      setTable(message?.data || []);
      settotalEventList(message?.pagination?.total_count || 0);
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
                {companyDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>
                    {item?.description}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">Company</TableHead>
              <TableHead className="text-center text-black">Material Code</TableHead>
              <TableHead className="text-center text-black">Material Description</TableHead>
              <TableHead className="text-center text-black">Material Type</TableHead>
              <TableHead className="text-center text-black">Plant</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              table.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  <TableCell className="text-center">{row.company}</TableCell>
                  <TableCell className="text-center text-nowrap">{row.material_code}</TableCell>
                  <TableCell className="text-center">{row.material_description}</TableCell>
                  <TableCell className="text-center">{row.material_type}</TableCell>
                  <TableCell className="text-center">{row.plant}</TableCell>
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
