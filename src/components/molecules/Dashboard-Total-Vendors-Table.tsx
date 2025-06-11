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
import { tableData } from "@/src/constants/dashboardTableData";
import { Input } from "../atoms/input";
import { DashboardTableType } from "@/src/types/types";
import Link from "next/link";
import { Button } from "../atoms/button";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import Cookies from "js-cookie";
import Pagination from "./Pagination";
import { Eye } from "lucide-react";
import VendorCodeDialog from "./VendorCodeDialog";
type Props = {
  dashboardTableData: DashboardTableType,
  companyDropdown:{name:string}[]
}

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

const DashboardTotalVendorsTable = ({ dashboardTableData,companyDropdown }: Props) => {
  const [table,setTable] = useState<DashboardTableType["total_vendor_onboarding"]>(dashboardTableData?.total_vendor_onboarding);
  const [selectedCompany,setSelectedCompany] = useState<string>("")
  const [search,setSearch] = useState<string>("");

   const [total_event_list,settotalEventList] = useState(0);
  const [record_per_page,setRecordPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isVendorCodeDialog,setIsVendorCodeDialog] = useState<boolean>(false);
  const [refno,setRefno] = useState("");

  const user = Cookies?.get("user_id");
  console.log(user,"this is user")

  const debouncedSearchName = useDebounce(search, 300);
  
  useEffect(()=>{
      fetchTable();
  },[debouncedSearchName,selectedCompany])
  
  
  const handlesearchname = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value,"this is search name")
    setSearch(value);
  }
  
  const fetchTable = async()=>{
    const dashboardTotalVendorTableDataApi: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.dashboardTotalVendorTableURL}?usr=${user}&company=${selectedCompany}&refno=${search}&page_no=${currentPage}`,
      method: "GET",
    });
    if(dashboardTotalVendorTableDataApi?.status == 200 ){
      setTable(dashboardTotalVendorTableDataApi?.data?.message?.total_vendor_onboarding);
      settotalEventList(dashboardTotalVendorTableDataApi?.data?.message?.total_count)
      setRecordPerPage(dashboardTotalVendorTableDataApi?.data?.message?.total_vendor_onboarding?.length)
      console.log(dashboardTotalVendorTableDataApi?.data?.message,"this is after filter api")
      // setRecordPerPage()
    } 
  }

  const handleVendorCodeDialog = (refno:string)=>{
    setRefno(refno);
    setIsVendorCodeDialog((prev)=>!prev);
  }

  
  return (
    <>
    <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold text-nowrap">
          Total Vendors
        </h1>
        <div className="flex gap-4 justify-end w-full">
          <div className="w-fit flex gap-4">
          <Input placeholder="Search..." onChange={(e=>{handlesearchname(e)})} />
          <Select onValueChange={(value)=>{setSelectedCompany(value)}}>
            <SelectTrigger className="w-96">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                {
                  companyDropdown?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          {/* <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
            <TableHead className="w-[100px]">Sr No.</TableHead>
            <TableHead>Ref No.</TableHead>
            <TableHead>Vendor Name</TableHead>
            <TableHead className="text-center">Company Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Purchase Team</TableHead>
            <TableHead className="text-center">Purchase Head</TableHead>
            <TableHead className="text-center">Account Team</TableHead>
            <TableHead className="text-center">View Details</TableHead>
            <TableHead className="text-center">QMS Form</TableHead>
            <TableHead className="text-center">Vendor code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center text-black">
          {table?.length> 0 ? (
            table.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell className="text-nowrap">{item?.ref_no}</TableCell>
                <TableCell>{item?.vendor_name?item?.vendor_name:'-'}</TableCell>
                <TableCell className="text-nowrap">{item?.company_name?item?.company:"-"}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-3 rounded-xl uppercase ${item?.onboarding_form_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item?.onboarding_form_status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      
                  >
                    {item?.onboarding_form_status?item?.onboarding_form_status:"-"}
                  </div>
                </TableCell>
                <TableCell>{item?.purchase_t_approval}</TableCell>
                <TableCell>{item?.purchase_h_approval}</TableCell>
                <TableCell>{item?.accounts_t_approval}</TableCell>
                <TableCell><Link href={`/view-onboarding-details?tabtype=Company%20Detail&vendor_onboarding=${item?.name}&refno=${item?.ref_no}`}><Button variant={"outline"}>View</Button></Link></TableCell>
                <TableCell className="text-center">{item?.qms_form}</TableCell>
                <TableCell className="pl-6"><button onClick={()=>{handleVendorCodeDialog(item?.ref_no)}}><Eye/></button></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list}/>
      {
        isVendorCodeDialog && 
        <VendorCodeDialog handleClose={setIsVendorCodeDialog} vendor_ref_no={refno}/>
      }
      </>
  );
};

export default DashboardTotalVendorsTable;
