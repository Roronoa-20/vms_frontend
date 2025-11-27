"use client";
import { useState } from "react";
import MultipleFileUpload from "./MultipleFileUpload";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { companyDropdownType, requestornameDropdownType, requestDropdownType, formDataType } from "@/src/types/GR-waiverIterm";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Input } from "../atoms/input";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import SimpleFileUpload from "@/src/components/molecules/multiple_file_upload";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


type Props = {
  DivisionDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
  requestornameDropdownData: requestornameDropdownType[]
  requestDropdownData: requestDropdownType[]
  GRWaiverData: formDataType
}

export default function GRWaiver({ DivisionDropdown, requestornameDropdownData, requestDropdownData, GRWaiverData }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [formData, setformData] = useState<formDataType>(GRWaiverData);
  console.log("GR Waiver Data--------->", GRWaiverData)

  const handlefieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setformData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: any, name: string) => {
    if (name == "requestor_name") {
    }
    setformData((prev: any) => ({ ...prev, [name]: value }));
  };

  const FetchRequestorDetail = async (requestor_name: string) => {
    const url = API_END_POINTS?.requestorDetailsBasedOnReuqstorName;
    const requestorApi: AxiosResponse = await requestWrapper({
      url: url,
      method: "GET",
      params: { employee_name: requestor_name }
    });

    if (requestorApi?.status == 200) {
      setformData((prev: any) => ({
        ...prev,
        email_id: requestorApi?.data?.message?.data?.user_id,
        reporting_head_name: requestorApi?.data?.message?.data?.reports_to,
        reports_to_email: requestorApi?.data?.message?.data?.reports_to_email,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      if (!formData) {
        console.error("Form data missing");
        return;
      }
      const url = API_END_POINTS.creategrwaiver;
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value as any);
      });
      if (files && files.length > 0) {
        files.forEach((file: File) => {
          payload.append("declaration__letter", file);
        });

      }

      const response: AxiosResponse = await requestWrapper({
        url: url,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.status === 200) {
        console.log("GR Waiver submitted successfully", response.data);
        alert("Submitted successfully!");
      } else {
        console.error("Error submitting GR waiver:", response.data);
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };



  return (
    <div className="min-h-screen w-full bg-gray-100 p-0 m-0">
      <div className="w-full h-full bg-white p-2 overflow-y-auto rounded-none shadow-none">
        {/* Requestor Detail */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4 border border-gray-300">
          <h2 className="text-lg font-semibold">Requestor Detail</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Requestor Name</h1>
              <Select
                onValueChange={(value) => { handleSelectChange(value, "requestor_name"), FetchRequestorDetail(value) }}
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
                onChange={(e) => { handlefieldChange(e) }}
                name="email_id"
                value={formData?.email_id ?? ""}
                disabled
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Reporting Head Name:</h1>
              <Input
                required
                onChange={(e) => { handlefieldChange(e) }}
                name="reporting_head_name"
                value={formData?.reporting_head_name ?? ""}
                disabled
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Reporting Email Id:</h1>
              <Input
                required
                onChange={(e) => { handlefieldChange(e) }}
                name="reporting_head_email_id"
                value={formData?.reporting_head_email_id ?? ""}
                disabled
              />
            </div>

            <div className="flex flex-col col-span-1">
              <h1 className="text-[14px] font-normal text-black pb-2">Request Type:</h1>
              <Select
                onValueChange={(value) => handleSelectChange(value, "request_type")}
                value={formData?.request_type ?? ""}
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
                    {DivisionDropdown?.length ? (
                      DivisionDropdown.map((item) => (
                        <SelectItem value={item?.name} key={item?.name}>
                          {item?.company_name}
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
                onChange={(e) => { handlefieldChange(e) }}
                name="material"
                value={formData?.material ?? ""}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Material Description:</h1>
              <Input
                required
                onChange={(e) => { handlefieldChange(e) }}
                name="material_description"
                value={formData?.material_description ?? ""}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Party:</h1>
              <Input
                required
                onChange={(e) => { handlefieldChange(e) }}
                name="party"
                value={formData?.party ?? ""}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">Quantity:</h1>
              <Input
                required
                onChange={(e) => { handlefieldChange(e) }}
                name="quantity"
                value={formData?.quantity ?? ""}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[14px] font-normal text-black pb-2">GR Waiver Closer Date:</h1>
              <Input
                required
                type="date"
                onChange={(e) => handlefieldChange(e)}
                name="tentative_closer_date"
                value={formData?.tentative_closer_date ?? ""}
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="mt-6">
            <h2 className="text-[14px] mb-2">Declaration letter on customer letter head:</h2>

            <SimpleFileUpload
              files={files}
              setFiles={setFiles}
              setUploadedFiles={setUploadedFiles}
              buttonText="Attach Files"
              onNext={() => {
                console.log("Files uploaded:", uploadedFiles);
              }}
            />

            {/* SHOW EXISTING FILE WHEN VIEWING AN ENTRY */}
            {!files.length && formData?.declaration__letter?.file_url && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Already Uploaded File:</h3>
                <a
                  href={formData.declaration__letter.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {formData.declaration__letter.file_name}
                </a>
              </div>
            )}


            {/* File preview list */}
            <div className="mt-4">
              {files.length === 0 ? (
                <p className="text-gray-500 text-sm">No files uploaded</p>
              ) : (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center px-3 py-2 bg-gray-100 rounded border w-[32%]"
                    >
                      <span className="flex items-center gap-4 text-sm">
                        {file.name}
                        <Trash2
                          size={16}
                          className="text-red-600 cursor-pointer hover:text-red-800 transition"
                          onClick={() => {
                            setFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              variant={"nextbtn"}
              size={"nextbtnsize"}
              className="py-2.5"
            >
              Submit
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={() => window.history.back()}
            className="py-2.5"
            variant={"backbtn"}
            size={"backbtnsize"}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}