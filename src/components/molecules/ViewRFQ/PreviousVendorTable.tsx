
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/table"
import { RFQDetails } from '@/src/types/RFQtype'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users } from 'lucide-react'

interface Props {
  RFQData: RFQDetails
}

const PreviousVendorTable = ({ RFQData }: Props) => {
  const merged = [...RFQData.onboarded_vendors, ...RFQData.non_onboarded_vendors];  
  return (
    <Dialog>
      {/* Trigger button to open dialog */}
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#2568EF] text-white hover:bg-[#1f50bb] hover:text-white w-fit">
         <Users className="h-4 w-4 text-white ml-1" /> Previous Vendors
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Previous Vendors list
          </DialogTitle>
        </DialogHeader>

        {/* Table inside dialog */}
        <div className="overflow-y-scroll max-h-[60vh]">
          <Table>
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                <TableHead>#</TableHead>
                <TableHead className="text-center">Vendor Name</TableHead>
                <TableHead className="text-center">Vendor Code</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Service Provider</TableHead>
                <TableHead className="text-center">Country</TableHead>
                {/* <TableHead className="text-center">Quotations Submitted</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody className="text-center bg-white">
              {merged?.length > 0 ? (
                merged.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.vendor_name}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.vendor_code?.length > 0
                        ? item.vendor_code.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.mobile_number}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.office_email_primary}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.service_provider_type}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      {item?.country}
                    </TableCell>
                    {/* <TableCell className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {item?.quotations?.length}
                      </span>
                    </TableCell> */}
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
      </DialogContent>
    </Dialog>
  )
}

export default PreviousVendorTable
