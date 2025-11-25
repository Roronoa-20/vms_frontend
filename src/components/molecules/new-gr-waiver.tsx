"use client";
import { useState } from "react";
import MultipleFileUpload from "./MultipleFileUpload";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { companyDropdownType, requestornameDropdownType, requestDropdownType } from "@/src/app/(afterLogin)/new-gr-waiver/page";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Input } from "../atoms/input";

type Props = {
  divisionDropdownData:companyDropdownType[]
  requestornameDropdownData:requestornameDropdownType[]
  requestDropdownData:requestDropdownType[]
}

// type Field = {
//   label: string;
//   type: "text" | "date" | "select" | "text-date" | "number";
//   placeholder?: string;
//   rows?: number;
//   name?:string
//   value?:any
// };

type formDataType = {
  requestor_name:string
  email_id:string
  reporting_head_name:string
  reports_to_email:string
  requestor_type:string
  division:string
  material:string
  material_description:string
  party:string
  quantity:number
  tentative_closer_date:string

  
  approval_status: string
	remark: string

	logistic_approval_status: string
	invoice_no: number
	amount_in_fc: number
	port_of_loading:string
	currency: string
	amount_in_inr: number
	logistic_remark: string
	invoice_date: string
	port_of_discharge: string
	port_code: number
	exrate: string

  accountsapproval_status: string
	bank: string
	accounts_remark: string
	gr_waiver_no: number
  
	sb_no: number
	awb_no: number
	shipping_amount_in_fc: string
	shipping_exrate: string
	shiping_bill: string
	sb_date:string
	awb_date: string
	dispatch_currency: string
	shipping_amount_in_inr: string

	account_approval_status: string
	account_approval_remark: string

	boe_no: number
	boe_date: string

	account_closer_approval_status: string
	status: string
	account_closer_remark: string
}

export default function GRWaiver({divisionDropdownData, requestornameDropdownData, requestDropdownData}:Props) {
  const [files, setFiles] = useState<File[]>([]);

const [formData, setformData] = useState<formDataType | null>(null);

  const handlefieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformData((prev:any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: any, name: string) => {

    if(name == "requestor_name"){
      
    }

    setformData((prev:any) => ({ ...prev, [name]: value }));
  };

  const FetchRequestorDetail = async(requestor_name:string)=>{
    const url = API_END_POINTS?.requestorDetailsBasedOnReuqstorName;
  const requestorApi: AxiosResponse = await requestWrapper({
    url: url,
    method: "GET",
    params:{employee_name:requestor_name}
  });

    if(requestorApi?.status == 200){
      setformData((prev:any)=>({...prev,
        email_id:requestorApi?.data?.message?.data?.user_id,
        reporting_head_name:requestorApi?.data?.message?.data?.reports_to,
        reports_to_email:requestorApi?.data?.message?.data?.reports_to_email,
      }))
    }
  }

  console.log(formData,"this is form data")

   const handleSubmit = (section: string) => {
    console.log(`Submitting ${section} form...`);
   };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-start p-2">
      <div className="w-full max-w-7xl bg-white p-6 rounded-sm shadow-lg space-y-8 border border-gray-200 overflow-y-auto">

        {/* Requestor Detail */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Requestor Detail</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Requestor Name</h1>
              <Select
                onValueChange={(value) => {handleSelectChange(value, "requestor_name"),FetchRequestorDetail(value)}}
                value={formData?.requestor_name ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {requestornameDropdownData?.length ? (
                      requestornameDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Email</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="email_id"
                value={formData?.email_id ?? ""}
                disabled
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Reporting Head Name:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="reporting_head_name"
                value={formData?.reporting_head_name ?? ""}
                disabled
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Reporting Email Id:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="reports_to_email"
                value={formData?.reports_to_email ?? ""}
                disabled
              />
           </div>

            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Request Type:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "requestor_type")}
                value={formData?.requestor_type ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {requestDropdownData?.length ? (
                      requestDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Division:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "division")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Material</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="material"
                value={formData?.material ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Material Description:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="material_description"
                value={formData?.material_description ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Party:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="party"
                value={formData?.party ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Quantity:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="quantity"
                value={formData?.quantity ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Tentative Closer Date:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="tentative_closer_data"
                value={formData?.tentative_closer_date ?? ""}
              />
           </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-semibold">Uploaded Documents</h2>

            <MultipleFileUpload
              files={files}
              setFiles={setFiles}
              buttonText="Attach Files"
              onNext={(uploadedFiles) => {
                console.log("Files uploaded:", uploadedFiles);
              }}
            />
          </div>

          {/* FILE TABLE */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">File Name</th>
                  <th className="border px-4 py-2">File Uploaded By</th>
                  <th className="border px-4 py-2">Upload Date & Time</th>
                  <th className="border px-4 py-2">Download</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No files uploaded
                    </td>
                  </tr>
                )}

                {files.map((file, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">Current User</td>
                    <td className="border px-4 py-2">
                      {new Date().toLocaleString()}
                    </td>
                    <td
                      className="border px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </td>
                    <td
                      className="border px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => {
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("Requestor Detail")}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>
        </div>
        
        {/* Reporting Head Approval */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Reporting Head Approval</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Approval status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "approval_status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Remark:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="remark"
                 value={formData?.remark ?? ""}
              />
           </div>
          </div> 
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>       
        </div> 
        
        {/* Logistic Details */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Logistic Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* {LogisticDetails.map(renderField)} */}
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Approval status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "logistic_approval_status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Remark:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="logistic_remark"
                 value={formData?.logistic_remark ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Invoice No:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="invoice_no"
                value={formData?.invoice_no ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Invoice Date:</h1>
              <Input
                required
                type="date"
                onChange={(e)=>{handlefieldChange(e)}}
                name="invoice_date"
                 value={formData?.invoice_date ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Amount In FC:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="amount_in_fc"
                 value={formData?.amount_in_fc ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Port of Discharge:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="port_of_discharge"
                value={formData?.port_of_discharge ?? ""}
              />
           </div>

           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Port of Loading:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="port_of_loading"
                value={formData?.port_of_loading ?? ""}
              />
           </div>
          
           <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Port Code:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "port_code")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Currency:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "currency")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">EX.Rate:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="exrate"
                value={formData?.exrate ?? ""}
              />
           </div>
          
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Amount In INR:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="amount_in_inr"
                value={formData?.amount_in_inr ?? ""}
              />
           </div>
           
          </div>

          {/* FILE UPLOAD */}
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-semibold">Uploaded Documents</h2>

            <MultipleFileUpload
              files={files}
              setFiles={setFiles}
              buttonText="Attach Files"
              onNext={(uploadedFiles) => {
                console.log("Files uploaded:", uploadedFiles);
              }}
            />
          </div>

          {/* FILE TABLE */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">File Name</th>
                  <th className="border px-4 py-2">File Uploaded By</th>
                  <th className="border px-4 py-2">Upload Date & Time</th>
                  <th className="border px-4 py-2">Download</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No files uploaded
                    </td>
                  </tr>
                )}

                {files.map((file, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">Current User</td>
                    <td className="border px-4 py-2">
                      {new Date().toLocaleString()}
                    </td>
                    <td
                      className="border px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </td>
                    <td
                      className="border px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => {
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("Requestor Detail")}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Accounts Details */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Accounts Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* {renderSection("Accounts Details", AccountsDetails)} */}
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Approval status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "accountsapproval_status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Remark:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="accounts_remark"
                value={formData?.accounts_remark ?? ""}
              />
           </div>

           <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Bank:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "bank")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

             <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">GR Waiver No:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="gr_waiver_no"
                value={formData?.gr_waiver_no ?? ""}
              />
           </div>

          </div> 
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>       
        </div> 
        

        {/*Dispatch Form */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Dispatch Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* {DispatchForm.map(renderField)} */}
            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">SB No:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="sb_no"
                value={formData?.sb_no ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">SB Date:</h1>
              <Input
                required
                type="date"
                onChange={(e)=>{handlefieldChange(e)}}
                name="sb_date"
                value={formData?.sb_date ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">AWB No:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="awb_no"
                value={formData?.awb_no ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">AWB Date:</h1>
              <Input
                required
                type="date"
                onChange={(e)=>{handlefieldChange(e)}}
                name="awb_date"
                value={formData?.awb_date ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Shipping Amount In FC:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="shipping_amount_in_fc"
                value={formData?.shipping_amount_in_fc ?? ""}
              />
           </div>
           <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Currency EX.Rate:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "dispatch_currency")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Shipping EX.Rate:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="shipping_exrate"
                value={formData?.shipping_exrate ?? ""}
              />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Shipping Amount In INR:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="shipping_amount_in_inr"
                value={formData?.shipping_amount_in_inr ?? ""}
              />
           </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-semibold">Uploaded Documents</h2>

            <MultipleFileUpload
              files={files}
              setFiles={setFiles}
              buttonText="Attach Files"
              onNext={(uploadedFiles) => {
                console.log("Files uploaded:", uploadedFiles);
              }}
            />
          </div>

          {/* FILE TABLE */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">File Name</th>
                  <th className="border px-4 py-2">File Uploaded By</th>
                  <th className="border px-4 py-2">Upload Date & Time</th>
                  <th className="border px-4 py-2">Download</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No files uploaded
                    </td>
                  </tr>
                )}

                {files.map((file, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">Current User</td>
                    <td className="border px-4 py-2">
                      {new Date().toLocaleString()}
                    </td>
                    <td
                      className="border px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </td>
                    <td
                      className="border px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => {
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("Requestor Detail")}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>
        </div>
        
        {/* Account Approval */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Account Approval</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/*  {renderSection("Account Approval", ReportingHeadApproval)} */}
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Approval status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "account_approval_status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Remark:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="account_approval_remark"
                value={formData?.account_approval_remark ?? ""}
              />
           </div>

          </div> 
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>       
        </div> 
        
        {/* Closure Form */}
        <div className="bg-white p-4 rounded-lg shadow space-y-6 border border-gray-300">
          <div className="p-4 rounded-lg shadow space-y-4 border border-gray-200">
            <h2 className="text-lg font-semibold">Closure Form</h2>
            <div className="space-y-2">
              <h3 className="text-md font-semibold">Requestor Closer Detail</h3>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* {CloserDetail.map(renderField)} */}
                <div className="flex flex-col">
                  <h1 className="text-[14px] font-normal text-black pb-2">BOE NO:</h1>
                  <Input
                    required
                    onChange={(e)=>{handlefieldChange(e)}}
                    name="boe_no"
                    value={formData?.boe_no ?? ""}
                  />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-[14px] font-normal text-black pb-2">BOE Date:</h1>
                  <Input
                    required
                    type="date"
                    onChange={(e)=>{handlefieldChange(e)}}
                    name="boe_date"
                    value={formData?.boe_date ?? ""}
                  />
              </div>
              </div>

              {/* FILE UPLOAD */}
              <div className="flex justify-between items-center mt-6">
                <h2 className="text-lg font-semibold">Uploaded Documents</h2>

                <MultipleFileUpload
                  files={files}
                  setFiles={setFiles}
                  buttonText="Attach Files"
                  onNext={(uploadedFiles) => {
                    console.log("Files uploaded:", uploadedFiles);
                  }}
                />
              </div>

          {/* FILE TABLE */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">File Name</th>
                  <th className="border px-4 py-2">File Uploaded By</th>
                  <th className="border px-4 py-2">Upload Date & Time</th>
                  <th className="border px-4 py-2">Download</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No files uploaded
                    </td>
                  </tr>
                )}

                {files.map((file, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">Current User</td>
                    <td className="border px-4 py-2">
                      {new Date().toLocaleString()}
                    </td>
                    <td
                      className="border px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </td>
                    <td
                      className="border px-4 py-2 text-red-600 cursor-pointer"
                      onClick={() => {
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("Requestor Detail")}
              className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              style={{ backgroundColor: "#5291CD" }}
            >
              Submit
            </button>
          </div>
        </div>
            {/*<div>
              <a
                href="/path-to-certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download Destruction Certificate
              </a>
            </div>*/}
          
          {/* Account Closer Detail */}
          <div className="p-4 rounded-lg shadow space-y-4 border border-gray-200">
            <h2 className="text-lg font-semibold">Account Closer Detail</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {AccountCloserDetail.map(renderField)} */}
              <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Approval status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "account_closer_approval_status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Remark:</h1>
              <Input
                required
                onChange={(e)=>{handlefieldChange(e)}}
                name="account_closer_remark"
                value={formData?.account_closer_remark ?? ""}
              />
           </div>
           <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Status:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "status")}
                value={formData?.division ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* {divisionDropdownData?.length ? (
                      divisionDropdownData.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center">No Value</div>
                    )} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSubmit("Account Closer Detail")}
                className="text-white px-6 py-2 rounded-xl shadow hover:border-blue-600 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                style={{ backgroundColor: "#5291CD" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => window.history.back()}
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-xl shadow transition hover:bg-blue-500 hover:text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}