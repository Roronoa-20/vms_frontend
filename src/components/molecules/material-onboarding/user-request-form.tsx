"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableHead, TableHeader, TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Delete } from "lucide-react";

export default function UserRequestForm() {
  return (
    <div className="bg-[#F4F4F6]">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
        <div>
          {/* Basic Data Section */}
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
            Basic Data
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3">
            {/* Company Code */}
            <div className="space-y-2">
              <FormField
                name="material_company_code"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Company Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Company Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="001">001 - Company A</SelectItem>
                          <SelectItem value="002">002 - Company B</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Plant Code */}
            <div className="space-y-2">
              <FormField
                name="plant_name"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Plant Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Plant Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PL01">PL01</SelectItem>
                          <SelectItem value="PL02">PL02</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Material Category */}
            <div className="space-y-2">
              <FormField
                name="material_category"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Material Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Material Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RAW">Raw Material</SelectItem>
                          <SelectItem value="FG">Finished Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Material Type */}
            <div className="space-y-2">
              <FormField
                name="material_type"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Material Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select Material Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MT01">MT01</SelectItem>
                          <SelectItem value="MT02">MT02</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Base UOM */}
            <div className="space-y-2">
              <FormField
                name="base_unit_of_measure"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Base Unit of Measure <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
                          <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KG">KG - Kilogram</SelectItem>
                          <SelectItem value="L">L - Litre</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Material Description */}
            <div className="col-span-2">
              <FormField
                name="material_name_description"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Material Name/Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        rows={2}
                        className="w-full p-[9px] text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-500 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter Material Description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Material Specifications */}
            <div className="col-span-3 grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  name="material_specifications"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Material Specifications <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={2}
                          className="w-full p-2 text-sm rounded-md placeholder:text-gray-400 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter Specifications"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  name="comment_by_user"
                  render={() => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <textarea
                          rows={2}
                          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-500 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter Comment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="mt-4 border p-4 rounded w-full overflow-auto">
            <h3 className="font-bold mb-2">Materials</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Company Code</TableHead>
                  <TableHead>Plant Code</TableHead>
                  <TableHead>Material Category</TableHead>
                  <TableHead>Material Type</TableHead>
                  <TableHead>Material Description</TableHead>
                  <TableHead>Base UOM</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2].map((i) => (
                  <TableRow key={i}>
                    <TableCell>{i}</TableCell>
                    <TableCell>001</TableCell>
                    <TableCell>PL01</TableCell>
                    <TableCell>Raw</TableCell>
                    <TableCell>MT01</TableCell>
                    <TableCell>Sample Material {i}</TableCell>
                    <TableCell>KG</TableCell>
                    <TableCell>Test comment</TableCell>
                    <TableCell>
                      <Delete className="ml-[15px] text-red-600" size={18} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Personal Data */}
        <div className="pt-4">
          <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1 mt-2">
            Personal Data
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <FormField
                name="requested_by_name"
                render={() => (
                  <FormItem>
                    <FormLabel>Requested By - Name</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        placeholder="Enter Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                name="requested_by_place"
                render={() => (
                  <FormItem>
                    <FormLabel>Requested By - Place</FormLabel>
                    <FormControl>
                      <Input
                        className="p-3 w-full text-sm placeholder:text-gray-400"
                        placeholder="Enter Place"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}