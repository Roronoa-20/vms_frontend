import React, { Dispatch, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import { Input } from '../../atoms/input'
import { DropdownData, newVendorTable } from './../RFQTemplates/LogisticsImportRFQ'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'

interface Props {
  open: boolean
  handleClose: () => void
  setNewVendorTable: Dispatch<React.SetStateAction<newVendorTable[]>>
  Dropdown: DropdownData
}

type ExistingVendor = {
  vendor_id: string;
  vendor_name: string;
  mobile_number: string;
  email: string;
};

type VerifyVendorResponse = {
  status: "no_duplicate" | "duplicate_found" | string;
  message: string;
  duplicate_count?: number;
  existing_vendors?: ExistingVendor[];
};

const AddVendorReviseRFQ = ({ open, handleClose, setNewVendorTable, Dropdown }: Props) => {
  const [singleRow, setSingleRow] = useState<newVendorTable | null>(null)

  const handleNewVendor = async (): Promise<void> => {
    if (!singleRow) return;

    const verifyURL = API_END_POINTS?.verifyNewVendor;
    const formdata = new FormData();
    formdata.append("email", JSON.stringify(singleRow.office_email_primary));
    formdata.append("mobile_number", JSON.stringify(singleRow.mobile_number));

    try {
      const response: AxiosResponse<{ message: VerifyVendorResponse }> = await requestWrapper({
        url: verifyURL,
        method: "POST",
        data: formdata,
      });

      const resData = response.data.message;

      if (response.status === 200) {
        const status = resData.status?.trim().toLowerCase();
        if (status === "no_duplicate") {
          setNewVendorTable((prev) => [...prev, singleRow]);
          setSingleRow(null);
          handleClose();
        } else if (status === "duplicate_found") {
          const existingVendors: ExistingVendor[] = resData.existing_vendors || [];
          const vendorNames = existingVendors.map((v) => v.vendor_name).join(", ");
          alert(`Duplicate entry found! Existing vendor(s): ${vendorNames}`);
          return;
        } else {
          alert(resData.message || "Unexpected response from server");
          return;
        }
      }
    } catch (error: any) {
      console.error("Error verifying vendor:", error);
      alert(error?.response?.data?.message || "Something went wrong while verifying vendor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-2">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Vendor Name</h1>
            <Input onChange={(e) => setSingleRow((prev: any) => ({ ...prev, vendor_name: e.target.value }))} placeholder="Enter Vendor Name" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Official Email Primary</h1>
            <Input onChange={(e) => setSingleRow((prev: any) => ({ ...prev, office_email_primary: e.target.value }))} placeholder="Enter Email Address" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Mobile Number</h1>
            <Input onChange={(e) => setSingleRow((prev: any) => ({ ...prev, mobile_number: e.target.value }))} placeholder="Enter Mobile Number" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Country</h1>
            <Select onValueChange={(value) => setSingleRow((prev: any) => ({ ...prev, country: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Dropdown?.country_master?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className={`${singleRow?.country?.includes("India") ? "" : "hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Company Pan Number</h1>
            <Input onChange={(e) => setSingleRow((prev: any) => ({ ...prev, pan_number: e.target.value }))} placeholder="Enter Company Pan" />
          </div>
          <div className={`${singleRow?.country?.includes("India") ? "" : "hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">Enter GST Number</h1>
            <Input onChange={(e) => setSingleRow((prev: any) => ({ ...prev, gst_number: e.target.value }))} placeholder="Enter GST Number" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleNewVendor} className="bg-blue-500 hover:bg-blue-600">Add Vendor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddVendorReviseRFQ
