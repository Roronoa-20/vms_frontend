"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Button } from '../atoms/button'
import { ProductHistory } from '../pages/Pr-Inquiry'
import { productHIstoryResponse } from '../pages/ProductHistory'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import Pagination from './Pagination'

interface Props {
  tableData: productHIstoryResponse
  refno: string,
  product_name: string
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
}

const ProductHistoryTable = ({ tableData, refno, product_name }: Props) => {
  const [productHistroytableData, setProductHistoryTable] = useState<ProductHistory[]>(tableData?.data);
  const [search, setSearch] = useState<string>("");
  const [total_event_list, settotalEventList] = useState(0);
  const [record_per_page, setRecordPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchName = useDebounce(search, 300);

  useEffect(() => {
    fetchTable();
  }, [debouncedSearchName, currentPage])

  const fetchTable = async () => {
    const response: AxiosResponse = await requestWrapper({
      url: `${API_END_POINTS?.FullProductHistory}?&page_no=${currentPage}&page_size=${record_per_page}&product_name=${product_name}`,
      method: "GET",
    });
    if (response?.status == 200) {
      setProductHistoryTable(response?.data?.message?.data);
      settotalEventList(response?.data?.message?.pagination?.total_records);
      setRecordPerPage(10);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.trim().split(" ")[0];
    if (!cleanDate) return "-";
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "-";
    return `${day}-${month}-${year}`;
  };

  return (
    <div className='pb-4'>
      <div className="shadow- bg-[#f6f6f7] mt-4 p-4 rounded-2xl">
        <Table className="max-h-40">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
              <TableHead className="text-black text-center text-nowrap">Sr. No.</TableHead>
              <TableHead className="text-black text-center text-nowrap">Cart Id</TableHead>
              <TableHead className="text-black text-center text-nowrap">User</TableHead>
              <TableHead className="text-black text-center text-nowrap">Cart Date</TableHead>
              <TableHead className="text-black text-center text-nowrap">Purchase Requisition Form</TableHead>
              <TableHead className="text-black text-center text-nowrap">Product Name</TableHead>
              <TableHead className="text-black text-center text-nowrap">Price</TableHead>
              <TableHead className="text-black text-center text-nowrap">Final Price</TableHead>
              <TableHead className="text-black text-center text-nowrap">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {productHistroytableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center text-nowrap">{index + 1}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.cart_id}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.user}</TableCell>
                <TableCell className="text-center text-nowrap">{formatDate(item?.cart_date)}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.purchase_requisition_form}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.product_name}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.price}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.final_price}</TableCell>
                <TableCell className="text-center text-nowrap">{item?.quantity}</TableCell>
                {/* <TableCell>
                    <Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{router.push(`/product-history?cart_id=${refno}&product_name=${item?.product_name}`)}}>View</Button>
                  </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
    </div>
  )
}

export default ProductHistoryTable