// {/* <>
//     {/* Procurement Type */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="procurement_type"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Procurement Type (if applicable)</FormLabel>
//                     <FormControl>
//                         <Select
//                             disabled={!isPurchaseTeam}
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                         >
//                             <SelectTrigger
//                                 className={`p-3 w-full border border-gray-400 text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""
//                                     }`}
//                             >
//                                 <SelectValue
//                                     placeholder={
//                                         isPurchaseTeam ? "Select Procurement Type" : "Only editable by Purchase Team"
//                                     }
//                                 />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {ProcurementType?.map((procurement) => (
//                                     <SelectItem key={procurement.name} value={procurement.name}>
//                                         {procurement.procurement_type_code} - {procurement.procurement_type_name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>
//     {/* Valuation Class */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="valuation_class"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Valuation Class</FormLabel>
//                     <FormControl>
//                         <Select
//                             disabled={!isPurchaseTeam}
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                         >
//                             <SelectTrigger
//                                 className={`p-3 w-full border border-gray-400 text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""
//                                     }`}
//                             >
//                                 <SelectValue
//                                     placeholder={
//                                         isPurchaseTeam ? "Select Valuation Class" : "Only editable by Purchase Team"
//                                     }
//                                 />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {ValuationClass?.map((vclass) => (
//                                     <SelectItem key={vclass.name} value={vclass.name}>
//                                         {vclass.valuation_class_code} - {vclass.valuation_class_name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>
//     {/* Reorder Point */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="reorder_point"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Reorder Point (if applicable)</FormLabel>
//                     <FormControl>
//                         <Input
//                             {...field}
//                             disabled={!isPurchaseTeam}
//                             className={`p-3 w-full text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""}`}
//                             placeholder={isPurchaseTeam ? "Enter Reorder Point" : "Only editable by Purchase Team"}
//                             onChange={(e) => {
//                                 const formattedValue = e.target.value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
//                                 field.onChange(formattedValue);
//                             }}
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>



//     {/* All remaininig fields */}
//     <div className="flex items-center justify-between text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//         <span>Purchasing Data</span>
//     </div>
//     <div className="grid grid-cols-3 gap-4">
//         {(role === "CP" || role === "Store") && (
//             <>


//                 {/* industry */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="industry"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Industry <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || undefined}
//                                         disabled={!isEditable}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Industry" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {IndustryDetails?.map((industry) => (
//                                                 <SelectItem key={industry.name} value={industry.name}>
//                                                     {industry.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 {/* Class Number */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="class_number"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Class Number</FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || undefined}

//                                     >
//                                         <SelectTrigger className={`p-3 w-full text-sm data-[placeholder]:text-gray-500`}>
//                                             <SelectValue placeholder="Select Class Number" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {ClassType?.map((classtype) => (
//                                                 <SelectItem key={classtype.name} value={classtype.name}>
//                                                     {classtype.class_number}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Old Material Group Dropdown */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="material_group"
//                         key="material_group"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>
//                                     Material Group <span className="text-red-500">*</span>
//                                 </FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || ""}

//                                     >
//                                         <SelectTrigger className={`p-3 w-full text-sm data-[placeholder]:text-gray-500`}>
//                                             <SelectValue placeholder="Select Material Group" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {filteredMaterialGroup?.map((group) => (
//                                                 <SelectItem key={group.name} value={group.name}>
//                                                     {group.name} - {group.material_group_description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//             </>
//         )}


//     </div>



//     {/* Procurement Type */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="procurement_type"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Procurement Type (if applicable)</FormLabel>
//                     <FormControl>
//                         <Select
//                             disabled={!isPurchaseTeam}
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                         >
//                             <SelectTrigger
//                                 className={`p-3 w-full border border-gray-400 text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""
//                                     }`}
//                             >
//                                 <SelectValue
//                                     placeholder={
//                                         isPurchaseTeam ? "Select Procurement Type" : "Only editable by Purchase Team"
//                                     }
//                                 />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {ProcurementType?.map((procurement) => (
//                                     <SelectItem key={procurement.name} value={procurement.name}>
//                                         {procurement.procurement_type_code} - {procurement.procurement_type_name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>
//     {/* Valuation Class */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="valuation_class"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Valuation Class</FormLabel>
//                     <FormControl>
//                         <Select
//                             disabled={!isPurchaseTeam}
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                         >
//                             <SelectTrigger
//                                 className={`p-3 w-full border border-gray-400 text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""
//                                     }`}
//                             >
//                                 <SelectValue
//                                     placeholder={
//                                         isPurchaseTeam ? "Select Valuation Class" : "Only editable by Purchase Team"
//                                     }
//                                 />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {ValuationClass?.map((vclass) => (
//                                     <SelectItem key={vclass.name} value={vclass.name}>
//                                         {vclass.valuation_class_code} - {vclass.valuation_class_name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>
//     {/* Reorder Point */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="reorder_point"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Reorder Point (if applicable)</FormLabel>
//                     <FormControl>
//                         <Input
//                             {...field}
//                             disabled={!isPurchaseTeam}
//                             className={`p-3 w-full text-sm placeholder:text-gray-400 ${!isPurchaseTeam ? "cursor-not-allowed bg-gray-100" : ""}`}
//                             placeholder={isPurchaseTeam ? "Enter Reorder Point" : "Only editable by Purchase Team"}
//                             onChange={(e) => {
//                                 const formattedValue = e.target.value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
//                                 field.onChange(formattedValue);
//                             }}
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>

//     {/* HSN Code */}
//     <div className="space-y-2">
//         <FormField
//             control={form.control}
//             name="hsn_code"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>HSN Code <span className="text-red-500">*</span></FormLabel>
//                     <FormControl>
//                         <Input
//                             {...field}
//                             type="text"
//                             maxLength={8}
//                             inputMode="numeric"
//                             pattern="\d{8}"
//                             disabled={!(isPurchaseTeam || role === "GST")}
//                             className={`p-3 w-full text-sm placeholder:text-gray-400 ${!(isPurchaseTeam || role === "GST") ? "cursor-not-allowed bg-gray-100" : ""}`}
//                             placeholder={(isPurchaseTeam || role === "GST") ? "Enter HSN Code" : "Only editable by Purchase Team"}
//                             onChange={(e) => {
//                                 const formattedValue = e.target.value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
//                                 field.onChange(formattedValue);
//                             }}
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     </div>



//     <div className="grid grid-cols-3 gap-4">
//         {role === "Store" && (
//             <>

//                 {/* Brand / Make */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="brand_make"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Brand / Make (if required)</FormLabel>
//                                 <FormControl>
//                                     <Input
//                                         {...field}
//                                         className="p-3 w-full text-sm placeholder:text-gray-400"
//                                         placeholder="Enter Brand / Make Name"
//                                         onChange={field.onChange}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 {/* Industry */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="industry"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Industry <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Industry" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {IndustryDetails?.map((industry) => (
//                                                 <SelectItem key={industry.name} value={industry.name}>
//                                                     {industry.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 {/* MRP Type */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="mrp_type"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>MRP Type <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Type of MRP" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {MRPType?.map((mrp) => (
//                                                 <SelectItem key={mrp.name} value={mrp.name}>
//                                                     {mrp.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* MRP Group */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="mrp_group"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>MRP Group</FormLabel>
//                                 <FormControl>
//                                     <Input
//                                         {...field}
//                                         className="p-3 w-full text-sm placeholder:text-gray-400"
//                                         placeholder="Enter MRP Group"
//                                         onChange={field.onChange}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* MRP Controller (Revised) */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="mrp_controller_revised"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>MRP Controller (Revised)</FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || undefined}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select MRP Controller" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {MRPController?.map((mrp) => (
//                                                 <SelectItem key={mrp.name} value={mrp.name}>
//                                                     {mrp.name} - {mrp.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Profit Center */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="profit_center"
//                         key="profit_center"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Profit Center<span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Profit Center" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {ProfitCenter?.map((profit) => (
//                                                 <SelectItem key={profit.profit_center_code} value={profit.profit_center_code}>
//                                                     {profit.profit_center_code} - {profit.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* GR Processing Time */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="gr_processing_time"
//                         render={({ field }) => {
//                             return (
//                                 <FormItem>
//                                     <FormLabel>GR Processing Time</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter GR Processing Time"
//                                             onChange={field.onChange}
//                                         // readOnly={!isEditable}

//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             );
//                         }}
//                     />
//                 </div>

//                 {/* Price Control */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="price_control"
//                         key="price_control"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Price Control <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Price Control" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {PriceControl?.map((price) => (
//                                                 <SelectItem key={price.price_control_code} value={price.price_control_code}>
//                                                     {price.price_control_code} - {price.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Valuation Category */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="valuation_category"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Valuation Category <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Valuation Category" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {ValuationCategory?.map((vcategory) => (
//                                                 <SelectItem key={vcategory.name} value={vcategory.name}>
//                                                     {vcategory.valuation_category_code} - {vcategory.valuation_category_name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Scheduling Margin Key */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="scheduling_margin_key"
//                         render={({ field }) => {
//                             return (
//                                 <FormItem>
//                                     <FormLabel>Scheduling Margin Key</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter Scheduling Margin Key"
//                                             onChange={field.onChange}
//                                         // readOnly={!isEditable}

//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             );
//                         }}
//                     />
//                 </div>
//                 {/* Minimum Remaining Shelf Life */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="minimum_remaining_shelf_life"
//                         render={({ field }) => {
//                             return (
//                                 <FormItem>
//                                     <FormLabel>Minimum Remaining Shelf Life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter minimum remaining shelf life"
//                                             onChange={field.onChange}
//                                         // readOnly={!isEditable}

//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             );
//                         }}
//                     />
//                 </div>
//                 {/* Total Shelf Life */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="total_shelf_life"
//                         render={({ field }) => {
//                             return (
//                                 <FormItem>
//                                     <FormLabel>Total shelf life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter total shelf life"
//                                             onChange={field.onChange}
//                                         // readOnly={!isEditable}

//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             );
//                         }}
//                     />
//                 </div>
//                 {/* Period Indicator for Shelf Life Expiration Date */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="expiration_date"
//                         render={({ field }) => {
//                             return (
//                                 <FormItem>
//                                     <FormLabel>Period Indicator for Shelf Life Expiration Date</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter period indicator for shelf life expiration date"
//                                             onChange={field.onChange}
//                                         // readOnly={!isEditable}

//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             );
//                         }}
//                     />
//                 </div>

//                 {/* Purchase UOM*/}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="purchase_uom"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Purchase UOM</FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || undefined}

//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Purchase UOM" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {UnitOfMeasure?.map((unit) => (
//                                                 <SelectItem key={unit.name} value={unit.name}>
//                                                     {unit.name} - {unit.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Issue UOM */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="issue_unit"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Issue Unit</FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value || undefined}

//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Issue Unit" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {UnitOfMeasure?.map((unit) => (
//                                                 <SelectItem key={unit.name} value={unit.name}>
//                                                     {unit.name} - {unit.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Inspection Type */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="inspection_type"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Inspection Type</FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue
//                                                 placeholder={
//                                                     InspectionType?.find((insp) => insp.name === "01")
//                                                         ? `01 - ${InspectionType.find((insp) => insp.name === "01").description}`
//                                                         : "Select Inspection Type"
//                                                 }
//                                             />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {InspectionType?.map((insp) => (
//                                                 <SelectItem key={insp.name} value={insp.name}>
//                                                     {insp.name} - {insp.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Do Not Cost */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="do_not_cost"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Do Not Cost</FormLabel>
//                                 <FormControl>
//                                     <Input
//                                         {...field}
//                                         // value={field.value ?? "X"}
//                                         // onChange={field.onChange}
//                                         className="p-3 w-full text-sm placeholder:text-gray-400"
//                                         placeholder="X"

//                                     />

//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 {/* Availability Check */}
//                 <div className="space-y-2">
//                     <FormField
//                         control={form.control}
//                         name="availability_check"
//                         key="availability_check"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Availability Check <span className="text-red-500">*</span></FormLabel>
//                                 <FormControl>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                     >
//                                         <SelectTrigger className="p-3 w-full text-sm">
//                                             <SelectValue placeholder="Select Availability Check" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {AvailabilityCheck?.map((availability) => (
//                                                 <SelectItem key={availability.name} value={availability.name}>
//                                                     {availability.name} - {availability.description}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//                 <div className="col-span-1 space-y-[5px]">
//                     <Label htmlFor="fileinput">
//                         Upload Material Information File
//                     </Label>
//                     <div className="border-2 border-dashed border-gray-400 rounded-lg">
//                         <div className="items-center">
//                             <div className="flex items-center justify-between gap-4 mt-1 px-2 py-2">
//                                 <input
//                                     type="file"
//                                     id="fileinput"
//                                     name="material_information"
//                                     className="hidden"
//                                     onChange={(event) => handleImageChange(event, "material_information")}
//                                 />
//                                 <div className="flex items-center gap-2">
//                                     {!fileSelected && (
//                                         <Paperclip
//                                             size={18}
//                                             className="cursor-pointer text-blue-600 hover:text-blue-800"
//                                             onClick={() => handleLabelClick("fileinput")}
//                                         />
//                                     )}

//                                     {!fileSelected ? (
//                                         <span className="text-sm text-gray-500">No file selected</span>
//                                     ) : (
//                                         <>
//                                             <span className="text-sm text-green-600 font-medium">{fileName}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 className="text-red-500 font-bold p-0 h-auto"
//                                                 onClick={() => handleRemoveFile("fileinput", setFileName)}
//                                             >
//                                                 ✕
//                                             </Button>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         )}

//     </div>
// </>

// {/* {((role === "CP" || role === "Store")) && (
//                             <button
//                                 type="button"
//                                 onClick={() => setIsEditable(!isEditable)}
//                                 className="text-gray-500 hover:text-black bg-[#5798ef] rounded-[24px] p-1 hover:bg-slate-500 transition duration-200 flex items-center"
//                             >
//                                 <Pencil className="w-6 h-6" />
//                             </button>
//                         )} */}



//                         const handleMaterialSearch = (e) => {
//         const val = e.target.value;

//         if (val.trim().length > 3) {
//             const filtered = MaterialDetails?.message?.filter((item) =>
//                 item.material_name_description?.toLowerCase().includes(val.toLowerCase())
//             );
//             setSearchResults(filtered || []);
//             setShowSuggestions(true);
//         } else {
//             setSearchResults([]);
//             setShowSuggestions(false);
//         }
//         setMaterialSelectedFromList(false);
//         setMaterialCodeAutoFetched(false);
//     };

//     const handleMaterialSelect = (item) => {
//         form.setValue("material_name_description", item.material_name_description);
//         form.setValue("material_code_revised", item.material_code_revised);
//         setMaterialSelectedFromList(true);
//         setMaterialCodeAutoFetched(true);
//         setShowSuggestions(false);
//     };


//     // +++++++++++++++++++++++++++++++++++++++++

//     export default function UserReqeustForm({
//     form, onSubmit, role, companyName, plantcode, UnitOfMeasure, EmployeeDetails, MaterialType, StorageLocation, searchResults, showSuggestions, handleMaterialSearch, handleMaterialSelect, setShowSuggestions, selectedMaterialType, setSelectedMaterialType, setMaterialCompanyCode, materialCompanyCode, MaterialDetails, MaterialCode, MaterialCategory, AllMaterialType, setIsMaterialCodeEdited, originalMaterialCodeRevised, MaterialOnboardingDetails, AllMaterialCodes
// }) {
//     const [filteredPlants, setFilteredPlants] = useState([]);
//     const [filteredMaterialType, setfilteredMaterialType] = useState([]);
//     const [filteredStorageLocations, setFilteredStorageLocations] = useState([]);
//     const [FilteredDivision, setFilteredDivision] = useState([]);
//     const selectedPlantName = form.watch("plant_name");

//     useEffect(() => {
//         if (!materialCompanyCode) return;

//         const updatedPlants = plantcode?.data?.filter((plant) => String(plant.company) === materialCompanyCode) || [];
//         const updatedMaterialTypes = MaterialType?.filter((group) => String(group.company) === materialCompanyCode) || [];

//         setFilteredPlants(updatedPlants);
//         setfilteredMaterialType(updatedMaterialTypes);

//         if (selectedPlantName && StorageLocation?.length) {
//             const filtered = StorageLocation.filter(
//                 (storage) => String(storage.plant_code) === selectedPlantName
//             );
//             setFilteredStorageLocations(filtered);
//         }
//     }, [materialCompanyCode, selectedPlantName, plantcode, MaterialType, StorageLocation]);

//     useEffect(() => {
//         const item = MaterialDetails?.material_request_item;
//         if (!item) return;

//         form.setValue("material_name_description", item.material_name_description || "");
//         form.setValue("comment_by_user", item.comment_by_user || "");

//         if (filteredPlants.length && item.plant_name) {
//             form.setValue("plant_name", item.plant_name);
//         }

//         if (filteredMaterialType.length && item.material_type) {
//             form.setValue("material_type", item.material_type);
//             setSelectedMaterialType(item.material_type);
//         }

//         if (item.company_name) {
//             setMaterialCompanyCode(item.company_name);
//             form.setValue("material_company_code", item.company_name);
//         }

//         if (UnitOfMeasure.length) {
//             form.setValue("base_unit_of_measure", item.base_unit_of_measure || "");
//         }

//         if (MaterialCategory.length) {
//             form.setValue("material_category", item.material_category || "");
//         }

//         if (AllMaterialCodes?.length && item.material_name_description) {
//             const match = AllMaterialCodes.find(
//                 (code) =>
//                     code.material_description?.toLowerCase().trim() ===
//                     item.material_name_description.toLowerCase().trim()
//             );
//             form.setValue("material_code_revised", match?.name || item.material_code_revised || "");
//         } else {
//             form.setValue("material_code_revised", item.material_code_revised || "");
//         }

//         const storage = MaterialDetails?.material_master;
//         if (storage.storage_location) {
//             form.setValue("storage_location", storage.storage_location);
//         }
//         if (storage.division) {
//             form.setValue("division", storage.division);
//         }
//         if (storage.old_material_code) {
//             form.setValue("old_material_code", storage.old_material_code);
//         }
//     }, [MaterialDetails, UnitOfMeasure, MaterialCategory, MaterialCode, filteredPlants, filteredMaterialType]);


//     useEffect(() => {
//         const subscription = form.watch((value, { name }) => {
//             if (
//                 (role === "CP" || role === "Store") &&
//                 name === "material_name_description" &&
//                 value.material_name_description &&
//                 AllMaterialCodes?.length > 0
//             ) {
//                 const input = value.material_name_description.trim().toLowerCase();
//                 const match = AllMaterialCodes.find(
//                     (code) =>
//                         code.material_description?.toLowerCase().trim() === input
//                 );
//                 form.setValue("material_code_revised", match?.name || "");
//             }
//         });
//         return () => subscription.unsubscribe();
//     }, [MaterialCode, role, form]);

//     useEffect(() => {
//         const materialName = form.getValues("material_name_description");
//         if (materialName && MaterialCode?.length > 0) {
//             const match = MaterialCode.find(
//                 (code) =>
//                     code.material_name_description?.trim().toLowerCase() === materialName.trim().toLowerCase() &&
//                     code.material_code_revised &&
//                     code.material_code_revised !== "null"
//             );
//             form.setValue("material_code_revised", match?.material_code_revised || "");
//         }
//     }, [form.watch("material_name_description"), MaterialCode]);

//     useEffect(() => {
//         if (!selectedMaterialType || !AllMaterialType?.length) {
//             setFilteredDivision([]);
//             return;
//         }

//         const selectedType = AllMaterialType.find(
//             (type) => type.name === selectedMaterialType
//         );

//         if (selectedType?.valuation_and_profit?.length) {
//             const divisions = selectedType.valuation_and_profit
//                 .map((vp) => vp.division)
//                 .filter(Boolean);

//             const uniqueDivisions = [...new Set(divisions)].map((name) => ({
//                 division_name: name
//             }));

//             setFilteredDivision(uniqueDivisions);
//         } else {
//             setFilteredDivision([]);
//         }
//     }, [selectedMaterialType, AllMaterialType]);

//     useEffect(() => {
//         const subscription = form.watch((value, { name }) => {
//             if (name === "material_code_revised") {
//                 const current = value.material_code_revised?.trim() || "";
//                 const original = originalMaterialCodeRevised.trim();
//                 setIsMaterialCodeEdited(current !== original);
//             }
//         });
//         return () => subscription.unsubscribe();
//     }, [form, originalMaterialCodeRevised]);

//     const showMaterialCodeStatuses = ["Pending by CP", "Sent to SAP", "Updated by CP", "Code Generated by SAP",];
//     const showMaterialCode = showMaterialCodeStatuses.includes(MaterialOnboardingDetails?.approval_status);
// } */}