import React, { Dispatch, useState } from 'react'
import PopUp from './PopUp'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { Input } from '../atoms/input'
import { DropdownData, newVendorTable } from '../templates/RFQTemplates/LogisticsImportRFQ'


interface Props {
    handleClose:()=>void
    setNewVendorTable:Dispatch<React.SetStateAction<newVendorTable[]>>
    Dropdown:DropdownData
}

const AddNewVendorRFQDialog = ({handleClose,setNewVendorTable,Dropdown}:Props) => {

  const [singleRow,setSingleRow] = useState<newVendorTable | null>(null)

  const handleNewVendor = ()=>{
    
      setNewVendorTable((prev:any)=>([...prev,singleRow]));
      setSingleRow(null)
      handleClose();
    }

  return (
    <PopUp disableRef={false} isSubmit={true} Submitbutton={handleNewVendor} headerText='Add New Vendor' classname='w-full h-full md:max-h-[350px] md:max-w-[700px]' handleClose={handleClose}>
        <div className="grid grid-cols-3 gap-6 p-5">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Vendor Name
            </h1>
            <Input onChange={(e)=>{setSingleRow((prev:any)=>({...prev,vendor_name:e.target.value}))}} placeholder="Enter Vendor Name" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Official Email Primary
            </h1>
            <Input onChange={(e)=>{setSingleRow((prev:any)=>({...prev,office_email_primary:e.target.value}))}} placeholder="Enter Email Address" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Mobile Number
            </h1>
            <Input onChange={(e)=>{setSingleRow((prev:any)=>({...prev,mobile_number:e.target.value}))}} placeholder="Enter Mobile Number" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Select onValueChange={(value)=>{setSingleRow((prev:any)=>({...prev,country:value}))}}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    Dropdown?.country_master?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className={`${singleRow?.country.includes("India")?"":"hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Company Pan Number
            </h1>
            <Input onChange={(e)=>{setSingleRow((prev:any)=>({...prev,pan_number:e.target.value}))}} placeholder="Enter Company Pan" />
            {/* {errors?.registered_office_number && !data?.registered_office_number && <span style={{ color: 'red' }}>{errors?.registered_office_number}</span>} */}
          </div>
          <div className={`${singleRow?.country.includes("India")?"":"hidden"}`}>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Enter GST Number
            </h1>
            <Input onChange={(e)=>{setSingleRow((prev:any)=>({...prev,gst_number:e.target.value}))}} placeholder="Enter GST Number" />
          </div>
        </div>
    </PopUp>
  )
}

export default AddNewVendorRFQDialog