"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Pagination from "../molecules/Pagination";
import { PurchaseRequisition } from "@/src/types/types";
import { GetPurchaseRequisitionTypeDropdown } from "@/src/services/prRequisition/prRequisitionNb.services";
import { purchaseRequisitionTypeDropdownType } from "@/src/types/prRequisition/prRequisition.types";
import Link from "next/link";

type Props = {
  data: PurchaseRequisition[];
  loading: boolean;
  companyDropdown: { description: string; name: string }[];
};

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ViewPRTable = ({ data, loading, companyDropdown }: Props) => {
  console.log(data, "this is data");

  const [table, setTable] = useState<PurchaseRequisition[]>(data || []);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [prTypeDropdown, setPRTypeDropdown] = useState<purchaseRequisitionTypeDropdownType[]>([]);
  const [selectedPRType, setSelectedPRType] = useState<string>("");

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, selectedCompany, currentPage, selectedPRType]);

  useEffect(() => {
    GetPurchaseRequisitionTypeDropdown()
      .then((res) => {
        setPRTypeDropdown(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlesearchname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchTable = async () => {
    const offset = (currentPage - 1) * record_per_page;
    const PRFormData: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.prTableData}?limit=${record_per_page}&offset=${offset}&company=${selectedCompany}&search_term=${debouncedSearchName}&pr_type=${selectedPRType === "all" ? "" : selectedPRType}`,
      method: "GET",
    });
    if (PRFormData?.status == 200) {
      setTable(PRFormData?.data?.message?.data);
      settotalEventList(PRFormData?.data?.message?.pagination?.total_count);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading PR data...</p>;

  return (
    <>
      <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Purchase Requisition Request
          </h1>
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search PR Name"
              value={search}
              onChange={handlesearchname}
            />
            <Select
              value={selectedCompany || "all"}
              onValueChange={(value) => setSelectedCompany(value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {companyDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item.name}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={selectedPRType}
              onValueChange={(value) => setSelectedPRType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select PR Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {prTypeDropdown?.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full pb-2">

        </div>
        <div className="max-h-[110vh]">
          <Table>
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead className="text-center text-black">Sr No.</TableHead>
                <TableHead className="text-center text-black">Ref No.</TableHead>
                <TableHead className="text-center text-black">SAP Ref No</TableHead>
                <TableHead className="text-center text-black">Company</TableHead>
                <TableHead className="text-center text-black">PR Type</TableHead>
                <TableHead className="text-center text-black">Requisitioner</TableHead>
                <TableHead className="text-center text-black text-nowrap">Status</TableHead>
                <TableHead className="text-center text-black">View PR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {table && table.length > 0 ? (
                table.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">
                      {(currentPage - 1) * record_per_page + (index + 1)}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">{item?.name}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.sap_pr_no ?? ""}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.company}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.pr_type}</TableCell>
                    <TableCell className="text-nowrap text-center">{item?.requisitioner}</TableCell>
                    <TableCell>
                      <div className={`text-center px-2 py-3 rounded-xl`}>
                        {item?.status ?? ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap text-center whitespace-nowrap">
                      <Link href={`/pr-request?pr_id=${item?.name}`}>
                        <Button className="bg-[#5291CD] text-white hover:bg-white hover:text-black rounded-[16px]">
                          View PR
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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

export default ViewPRTable;