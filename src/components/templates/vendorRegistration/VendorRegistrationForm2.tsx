'use client'
import { Input } from "@/components/ui/input";
import {useState} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { TcompanyNameBasedDropdown, TpurchaseOrganizationBasedDropdown, TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { useVendorStore } from '../../../store/VendorRegistrationStore';
import { AxiosResponse } from "axios";
import { Button } from "../../atoms/button";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handleSubmit } from "./utility";

interface Props {
  incoTermsDropdown:TvendorRegistrationDropdown["message"]["data"]["incoterm_master"]
  companyDropdown:TvendorRegistrationDropdown["message"]["data"]["company_master"]
  currencyDropdown:TvendorRegistrationDropdown["message"]["data"]["currency_master"]
  formData:Partial<VendorRegistrationData>
  handlefieldChange:(e:React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>void
      handleSelectChange:(value:any,name:string)=>void
}

const VendorRegistration2 = ({incoTermsDropdown,companyDropdown,currencyDropdown,formData,handlefieldChange,handleSelectChange}:Props) => {
  // const { data, updateField,updateVendorTypes, resetForm } = useVendorStore();
  const [companyBasedDropdown,setCompanyBasedDropdown] = useState<TcompanyNameBasedDropdown["message"]["data"]>();
  const [purchaseOrganizationBasedDropdown,setPurchaseOrganizationBasedDropdown] = useState<TpurchaseOrganizationBasedDropdown["message"]>()
  const router = useRouter();
  const handleCompanyDropdownChange = async(value:string)=>{
    handleSelectChange(value,'company_name');
    const url = API_END_POINTS?.companyBasedDropdown;
    const response = await requestWrapper({url:url,method:"GET",params:{company_name:value}})
    const data:TcompanyNameBasedDropdown = response?.status == 200?response?.data:"";
    setCompanyBasedDropdown(data?.message?.data);
  }

  const handlePurchaseOrganizationDropdownChange = async(value:string)=>{
    handleSelectChange(value,'purchase_organization');
    const url = API_END_POINTS?.purchaseGroupBasedDropdown;
    const response = await requestWrapper({url:url,method:"GET",params:{purchase_organization:value}})
    const data:TpurchaseOrganizationBasedDropdown = response?.status == 200?response?.data:"";
    setPurchaseOrganizationBasedDropdown(data?.message);
  }

  return (
    <div>
      <h1 className="text-[20px] font-medium pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
        Purchase Team Details
      </h1>
      <div className="px-10 grid grid-cols-4">
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Name
          </h1>
          <Select required={true} onValueChange={(value)=>{handleCompanyDropdownChange(value)}} value={formData?.company_name}>
            <SelectTrigger>
              <SelectValue placeholder="Select Company Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyDropdown ?
                  companyDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Organization
          </h1>
          <Select required onValueChange={(value)=>{handlePurchaseOrganizationDropdownChange(value)}} value={formData?.purchase_organization}>
            <SelectTrigger>
              <SelectValue placeholder="Select Purchase Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?.purchase_organizations ?
                  companyBasedDropdown?.purchase_organizations?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Group
          </h1>
          <Select required onValueChange={(value)=>{handleSelectChange(value,'account_group')}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Account Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  purchaseOrganizationBasedDropdown ?
                  purchaseOrganizationBasedDropdown?.map((item)=>(

                    <SelectItem value={item?.name} key={item?.name}>{item?.account_group_description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Select required onValueChange={(value)=>{handleSelectChange(value,'purchase_group')}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Purchase Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?
                  companyBasedDropdown?.purchase_groups?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Terms Of Payment
          </h1>
          <Select required onValueChange={(value)=>{handleSelectChange(value,'terms_of_payment')}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Terms Of Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?.terms_of_payment ?
                  companyBasedDropdown?.terms_of_payment?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Order Currency
          </h1>
          <Select required onValueChange={(value)=>{handleSelectChange(value,'order_currency')}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Order Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropdown ?
                  currencyDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Inco Terms
          </h1>
          <Select required onValueChange={(value)=>{handleSelectChange(value,'incoterms')}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Inco Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  incoTermsDropdown ? 
                  incoTermsDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button className="bg-blue-400 hover:bg-blue-400">Cancel</Button>
        <Button type="submit" className="bg-blue-400 hover:bg-blue-400">Submit</Button>
      </div>
    </div>
  );
};

export default VendorRegistration2;

