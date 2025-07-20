// "use client"

// import { useState, useMemo, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { X, Edit2, Check, ChevronDown } from "lucide-react"
// import { cn } from "@/lib/utils"

// export interface Material {
//   id: number
//   prNumber: string
//   requisitionNo: string
//   itemCode: string
//   itemDescription: string
//   quantity: number
//   uom: string
//   requisitionDate: string
//   deliveryDate: string
//   plant: string
// }

// export interface SelectedMaterial extends Material {
//   originalQuantity: number
//   originalDeliveryDate: string
//   isUpdated: boolean
// }

// interface PRMaterialsManagerProps {
//   availablePRs: string[]
//   materials: Material[]
//   onSelectionChange?: (selectedMaterials: SelectedMaterial[]) => void
//   title?: string
//   className?: string
//   disabled?: boolean
// }

// export default function PRMaterialsManager({
//   availablePRs,
//   materials,
//   onSelectionChange,
//   title = "PR Materials Management",
//   className = "",
//   disabled = false,
// }: PRMaterialsManagerProps) {
//   const [selectedPRs, setSelectedPRs] = useState<string[]>([])
//   const [selectedRows, setSelectedRows] = useState<number[]>([])
//   const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null)
//   const [updatedMaterials, setUpdatedMaterials] = useState<Material[]>(materials)
//   const [open, setOpen] = useState(false)
//   const [editValues, setEditValues] = useState<{ [key: string]: string | number }>({})

//   // Update materials when props change
//   useEffect(() => {
//     setUpdatedMaterials(materials)
//   }, [materials])

//   // Filter materials based on selected PRs
//   const filteredMaterials = useMemo(() => {
//     if (selectedPRs.length === 0) return []
//     return updatedMaterials.filter((material) => selectedPRs.includes(material.prNumber))
//   }, [updatedMaterials, selectedPRs])

//   // Get selected materials with update status
//   const selectedMaterials = useMemo(() => {
//     const selected = updatedMaterials
//       .filter((material) => selectedRows.includes(material.id))
//       .map((material) => {
//         const original = materials.find((m) => m.id === material.id)
//         return {
//           ...material,
//           originalQuantity: original?.quantity || material.quantity,
//           originalDeliveryDate: original?.deliveryDate || material.deliveryDate,
//           isUpdated: original?.quantity !== material.quantity || original?.deliveryDate !== material.deliveryDate,
//         }
//       })
//     return selected
//   }, [updatedMaterials, selectedRows, materials])

//   // Notify parent of selection changes
//   useEffect(() => {
//     onSelectionChange?.(selectedMaterials)
//   }, [selectedMaterials, onSelectionChange])

//   // Handle PR selection/deselection
//   const handlePRToggle = (prNumber: string) => {
//     if (disabled) return

//     setSelectedPRs((prev) => {
//       if (prev.includes(prNumber)) {
//         // Remove PR and its selected rows
//         const materialIdsToRemove = updatedMaterials
//           .filter((material) => material.prNumber === prNumber)
//           .map((material) => material.id)
//         setSelectedRows((current) => current.filter((id) => !materialIdsToRemove.includes(id)))
//         return prev.filter((pr) => pr !== prNumber)
//       } else {
//         // Add PR
//         return [...prev, prNumber]
//       }
//     })
//   }

//   // Handle PR removal from badge
//   const handlePRRemove = (prNumber: string) => {
//     if (disabled) return

//     setSelectedPRs((prev) => prev.filter((pr) => pr !== prNumber))
//     // Remove selected rows that belong to this PR
//     const materialIdsToRemove = updatedMaterials
//       .filter((material) => material.prNumber === prNumber)
//       .map((material) => material.id)
//     setSelectedRows((prev) => prev.filter((id) => !materialIdsToRemove.includes(id)))
//   }

//   // Handle row selection
//   const handleRowSelect = (materialId: number, checked: boolean) => {
//     if (disabled) return

//     setSelectedRows((prev) => {
//       if (checked) {
//         return [...prev, materialId]
//       } else {
//         return prev.filter((id) => id !== materialId)
//       }
//     })
//   }

//   // Handle select all
//   const handleSelectAll = (checked: boolean) => {
//     if (disabled) return

//     if (checked) {
//       setSelectedRows(filteredMaterials.map((material) => material.id))
//     } else {
//       setSelectedRows([])
//     }
//   }

//   // Start editing
//   const startEdit = (id: number, field: string, currentValue: string | number) => {
//     if (disabled) return

//     setEditingCell({ id, field })
//     setEditValues({ [`${id}-${field}`]: currentValue })
//   }

//   // Save edit
//   const saveEdit = (id: number, field: string) => {
//     if (disabled) return

//     const key = `${id}-${field}`
//     const value = editValues[key]

//     if (value !== undefined) {
//       setUpdatedMaterials((prev) =>
//         prev.map((material) =>
//           material.id === id ? { ...material, [field]: field === "quantity" ? Number(value) : value } : material,
//         ),
//       )
//     }

//     setEditingCell(null)
//     setEditValues((prev) => {
//       const newValues = { ...prev }
//       delete newValues[key]
//       return newValues
//     })
//   }

//   // Cancel edit
//   const cancelEdit = () => {
//     setEditingCell(null)
//     setEditValues({})
//   }

//   // Handle edit value change
//   const handleEditValueChange = (id: number, field: string, value: string | number) => {
//     setEditValues((prev) => ({ ...prev, [`${id}-${field}`]: value }))
//   }

//   const isAllSelected = filteredMaterials.length > 0 && selectedRows.length === filteredMaterials.length

//   return (
//     <div className={cn("space-y-6", className)}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl font-bold">{title}</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* PR Multiselect */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">Select Purchase Request Numbers</Label>

//             {/* Selected PRs Display */}
//             {selectedPRs.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {selectedPRs.map((pr) => (
//                   <Badge key={pr} variant="secondary" className="px-3 py-1">
//                     {pr}
//                     {!disabled && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
//                         onClick={() => handlePRRemove(pr)}
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     )}
//                   </Badge>
//                 ))}
//               </div>
//             )}

//             {/* PR Selection Dropdown */}
//             {!disabled && (
//               <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className="w-full justify-between bg-transparent"
//                   >
//                     {selectedPRs.length === 0 ? "Select PR Numbers..." : `${selectedPRs.length} PR(s) selected`}
//                     <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-full p-0">
//                   <Command>
//                     <CommandInput placeholder="Search PR numbers..." />
//                     <CommandList>
//                       <CommandEmpty>No PR numbers found.</CommandEmpty>
//                       <CommandGroup>
//                         {availablePRs.map((pr) => (
//                           <CommandItem key={pr} value={pr} onSelect={() => handlePRToggle(pr.sap_pr_code)}>
//                             <Check
//                               className={cn("mr-2 h-4 w-4", selectedPRs.includes(pr) ? "opacity-100" : "opacity-0")}
//                             />
//                             {pr}
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//             )}
//           </div>

//           {/* Materials Table */}
//           {filteredMaterials.length > 0 && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">Materials List</h3>
//                 <div className="text-sm text-muted-foreground">
//                   {selectedRows.length} of {filteredMaterials.length} items selected
//                 </div>
//               </div>

//               <div className="border rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted/50">
//                       <TableHead className="w-12">
//                         <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} disabled={disabled} />
//                       </TableHead>
//                       <TableHead className="w-16">Sr No.</TableHead>
//                       <TableHead>Requisition No.</TableHead>
//                       <TableHead>Item Code</TableHead>
//                       <TableHead className="min-w-[200px]">Item Description</TableHead>
//                       <TableHead>Quantity</TableHead>
//                       <TableHead>UOM</TableHead>
//                       <TableHead>Requisition Date</TableHead>
//                       <TableHead>Delivery Date</TableHead>
//                       <TableHead>Plant</TableHead>
//                       {!disabled && <TableHead className="w-20">Actions</TableHead>}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredMaterials.map((material, index) => {
//                       const isSelected = selectedRows.includes(material.id)
//                       const original = materials.find((m) => m.id === material.id)
//                       const isQuantityUpdated = original?.quantity !== material.quantity
//                       const isDateUpdated = original?.deliveryDate !== material.deliveryDate

//                       return (
//                         <TableRow key={material.id} className={isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""}>
//                           <TableCell>
//                             <Checkbox
//                               checked={isSelected}
//                               onCheckedChange={(checked) => handleRowSelect(material.id, checked as boolean)}
//                               disabled={disabled}
//                             />
//                           </TableCell>
//                           <TableCell className="font-medium">{index + 1}</TableCell>
//                           <TableCell>{material.requisitionNo}</TableCell>
//                           <TableCell className="font-mono text-sm">{material.itemCode}</TableCell>
//                           <TableCell>{material.itemDescription}</TableCell>

//                           {/* Quantity Cell */}
//                           <TableCell>
//                             {editingCell?.id === material.id && editingCell?.field === "quantity" ? (
//                               <div className="flex items-center gap-2">
//                                 <Input
//                                   type="number"
//                                   value={editValues[`${material.id}-quantity`] || material.quantity}
//                                   onChange={(e) => handleEditValueChange(material.id, "quantity", e.target.value)}
//                                   className="w-20"
//                                   onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                       saveEdit(material.id, "quantity")
//                                     } else if (e.key === "Escape") {
//                                       cancelEdit()
//                                     }
//                                   }}
//                                   autoFocus
//                                 />
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-6 w-6 p-0"
//                                   onClick={() => saveEdit(material.id, "quantity")}
//                                 >
//                                   <Check className="h-3 w-3" />
//                                 </Button>
//                                 <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
//                                   <X className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             ) : (
//                               <span className={isQuantityUpdated ? "text-orange-600 font-semibold" : ""}>
//                                 {material.quantity}
//                                 {isQuantityUpdated && " *"}
//                               </span>
//                             )}
//                           </TableCell>

//                           <TableCell>{material.uom}</TableCell>
//                           <TableCell>{material.requisitionDate}</TableCell>

//                           {/* Delivery Date Cell */}
//                           <TableCell>
//                             {editingCell?.id === material.id && editingCell?.field === "deliveryDate" ? (
//                               <div className="flex items-center gap-2">
//                                 <Input
//                                   type="date"
//                                   value={editValues[`${material.id}-deliveryDate`] || material.deliveryDate}
//                                   onChange={(e) => handleEditValueChange(material.id, "deliveryDate", e.target.value)}
//                                   className="w-36"
//                                   onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                       saveEdit(material.id, "deliveryDate")
//                                     } else if (e.key === "Escape") {
//                                       cancelEdit()
//                                     }
//                                   }}
//                                   autoFocus
//                                 />
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-6 w-6 p-0"
//                                   onClick={() => saveEdit(material.id, "deliveryDate")}
//                                 >
//                                   <Check className="h-3 w-3" />
//                                 </Button>
//                                 <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
//                                   <X className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             ) : (
//                               <span className={isDateUpdated ? "text-orange-600 font-semibold" : ""}>
//                                 {material.deliveryDate}
//                                 {isDateUpdated && " *"}
//                               </span>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             <Badge variant="outline">{material.plant}</Badge>
//                           </TableCell>

//                           {/* Actions Cell */}
//                           {!disabled && (
//                             <TableCell>
//                               <div className="flex gap-1">
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-8 w-8 p-0"
//                                   onClick={() => startEdit(material.id, "quantity", material.quantity)}
//                                   title="Edit Quantity"
//                                   disabled={editingCell !== null}
//                                 >
//                                   <Edit2 className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-8 w-8 p-0"
//                                   onClick={() => startEdit(material.id, "deliveryDate", material.deliveryDate)}
//                                   title="Edit Delivery Date"
//                                   disabled={editingCell !== null}
//                                 >
//                                   <Edit2 className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       )
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           )}

//           {/* Empty State */}
//           {selectedPRs.length === 0 && (
//             <div className="text-center py-12 text-muted-foreground">
//               <p className="text-lg">No PR numbers selected</p>
//               <p className="text-sm">Select PR numbers from the dropdown above to view materials</p>
//             </div>
//           )}

//           {selectedPRs.length > 0 && filteredMaterials.length === 0 && (
//             <div className="text-center py-12 text-muted-foreground">
//               <p className="text-lg">No materials found</p>
//               <p className="text-sm">The selected PR numbers don't have any associated materials</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useState, useMemo, useEffect, useCallback } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { X, Edit2, Check, ChevronDown, Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import API_END_POINTS from '@/src/services/apiEndPoints'
// import { AxiosResponse } from 'axios'
// import requestWrapper from '@/src/services/apiCall'
// export interface PRNumber {
//     name: string
//     sap_pr_code: string
// }

// export interface PRItem {
//     head_unique_field: string
//     requisition_no: string
//     material_code_head: string
//     material_name_head: string
//     quantity_head: number
//     uom_head: string
//     price_head: number
//     delivery_date_head: string
//     subhead_unique_field?: string
//     material_code_subhead?: string
//     material_name_subhead?: string
//     quantity_subhead?: number
//     uom_subhead?: string
//     price_subhead?: number
//     delivery_date_subhead?: string
// }

// export interface Material {
//     id: string
//     prNumber: string
//     requisitionNo: string
//     itemCode: string
//     itemDescription: string
//     quantity: number
//     uom: string
//     price: number
//     deliveryDate: string
//     type: "head" | "subhead"
//     originalQuantity: number
//     originalDeliveryDate: string
// }

// export interface SelectedMaterial extends Material {
//     isUpdated: boolean
// }

// interface PRMaterialsManagerProps {
//     prNumbers: PRNumber[]
//     onSelectionChange?: (selectedMaterials: SelectedMaterial[]) => void
//     title?: string
//     className?: string
//     disabled?: boolean
//     apiEndpoint?: string
// }
// // Convert API response to Material format
// const convertPRItemsToMaterials = (prItems: PRItem[]): Material[] => {
//     const materials: Material[] = []

//     prItems.forEach((item) => {
//         // Add head item
//         if (item.requisition_no) {
//             materials.push({
//                 id: item.head_unique_field || `${item.requisition_no}_${item.material_code_head}`,
//                 prNumber: item.requisition_no,
//                 requisitionNo: item.requisition_no,
//                 itemCode: item.material_code_head,
//                 itemDescription: item.material_name_head,
//                 quantity: item.quantity_head,
//                 uom: item.uom_head,
//                 price: item.price_head,
//                 deliveryDate: item.delivery_date_head,
//                 type: "head",
//                 originalQuantity: item.quantity_head,
//                 originalDeliveryDate: item.delivery_date_head,
//             })
//         }

//         // Add subhead item if exists
//         // if (item.material_code_subhead) {
//         //     materials.push({
//         //         id: item.subhead_unique_field || `${item.requisition_no}_${item.material_code_subhead}`,
//         //         prNumber: item.requisition_no,
//         //         requisitionNo: item.requisition_no,
//         //         itemCode: item.material_code_subhead,
//         //         itemDescription: item.material_name_subhead || "",
//         //         quantity: item.quantity_subhead || 0,
//         //         uom: item.uom_subhead || "",
//         //         price: item.price_subhead || 0,
//         //         deliveryDate: item.delivery_date_subhead || "",
//         //         type: "subhead",
//         //         originalQuantity: item.quantity_subhead || 0,
//         //         originalDeliveryDate: item.delivery_date_subhead || "",
//         //     })
//         // }
//     })

//     return materials
// }

// export default function PRMaterialsManager({
//     prNumbers,
//     onSelectionChange,
//     title = "PR Materials Management",
//     className = "",
//     disabled = false,
//     apiEndpoint = "/api/pr-items",
// }: PRMaterialsManagerProps) {
//     const [selectedPRs, setSelectedPRs] = useState<string[]>([])
//     const [selectedRows, setSelectedRows] = useState<string[]>([])
//     const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
//     const [materials, setMaterials] = useState<Material[]>([])
//     const [open, setOpen] = useState(false)
//     const [editValues, setEditValues] = useState<{ [key: string]: string | number }>({})
//     const [loading, setLoading] = useState(false)
//     // Fetch materials when selected PRs change
//     const fetchMaterials = useCallback(async (prCodes: string[]) => {
//         if (prCodes.length === 0) {
//             setMaterials([])
//             return
//         }

//         setLoading(true)
//         try {
//             // Replace this with your actual API call
//             //   const response = await fetchPRItems(prCodes)
//             //   const convertedMaterials = convertPRItemsToMaterials(response.pr_items)
//             console.log(prCodes, "prCodesprCodesprCodes befor change")
//             const url = `${API_END_POINTS?.fetchPRItems}`
//             const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { pr_numbers: prCodes } }, method: "POST" });
//             if (response?.status == 200) {
//                 console.log(response.data.message.pr_items, "response.data.message.pr_numbers")
//                 const convertedMaterials = convertPRItemsToMaterials(response.data.message.pr_items)
//                 setMaterials(convertedMaterials)
//                 console.log(response, "response of vendor table data")
//             } else {
//                 alert("error");
//             }


//         } catch (error) {
//             console.error("Error fetching PR items:", error)
//             setMaterials([])
//         } finally {
//             setLoading(false)
//         }
//     }, [])

//     // Update materials when selected PRs change
//     useEffect(() => {
//         fetchMaterials(selectedPRs)
//     }, [selectedPRs, fetchMaterials])

//     // Get selected materials with update status
//     const selectedMaterials = useMemo(() => {
//         const selected = materials
//             .filter((material) => selectedRows.includes(material.id))
//             .map((material) => ({
//                 ...material,
//                 isUpdated:
//                     material.quantity !== material.originalQuantity || material.deliveryDate !== material.originalDeliveryDate,
//             }))
//         return selected
//     }, [materials, selectedRows])

//     // Notify parent of selection changes
//     useEffect(() => {
//         onSelectionChange?.(selectedMaterials)
//     }, [selectedMaterials, onSelectionChange])

//     // Handle PR selection/deselection
//     const handlePRToggle = (prNumber: PRNumber) => {
//         if (disabled) return

//         setSelectedPRs((prev) => {
//             if (prev.includes(prNumber.sap_pr_code)) {
//                 // Remove PR and its selected rows
//                 const newPRs = prev.filter((pr) => pr !== prNumber.sap_pr_code)
//                 // Remove selected rows that belong to this PR
//                 setSelectedRows((current) =>
//                     current.filter((id) => {
//                         const material = materials.find((m) => m.id === id)
//                         return material && newPRs.includes(material.prNumber)
//                     }),
//                 )
//                 return newPRs
//             } else {
//                 // Add PR
//                 return [...prev, prNumber.sap_pr_code]
//             }
//         })
//     }

//     // Handle PR removal from badge
//     const handlePRRemove = (prCode: string) => {
//         if (disabled) return

//         setSelectedPRs((prev) => {
//             const newPRs = prev.filter((pr) => pr !== prCode)
//             // Remove selected rows that belong to this PR
//             setSelectedRows((current) =>
//                 current.filter((id) => {
//                     const material = materials.find((m) => m.id === id)
//                     return material && newPRs.includes(material.prNumber)
//                 }),
//             )
//             return newPRs
//         })
//     }

//     // Handle row selection
//     const handleRowSelect = (materialId: string, checked: boolean) => {
//         if (disabled) return

//         setSelectedRows((prev) => {
//             if (checked) {
//                 return [...prev, materialId]
//             } else {
//                 return prev.filter((id) => id !== materialId)
//             }
//         })
//     }

//     // Handle select all
//     const handleSelectAll = (checked: boolean) => {
//         if (disabled) return

//         if (checked) {
//             setSelectedRows(materials.map((material) => material.id))
//         } else {
//             setSelectedRows([])
//         }
//     }

//     // Start editing
//     const startEdit = (id: string, currentQuantity: number, currentDeliveryDate: string) => {
//         if (disabled) return

//         setEditingCell({ id, field: "both" })
//         setEditValues({
//             [`${id}-quantity`]: currentQuantity,
//             [`${id}-deliveryDate`]: currentDeliveryDate,
//         })
//     }

//     // Save edit
//     const saveEdit = (id: string) => {
//         if (disabled) return

//         const quantityKey = `${id}-quantity`
//         const dateKey = `${id}-deliveryDate`
//         const newQuantity = editValues[quantityKey]
//         const newDeliveryDate = editValues[dateKey]

//         if (newQuantity !== undefined && newDeliveryDate !== undefined) {
//             setMaterials((prev) =>
//                 prev.map((material) =>
//                     material.id === id
//                         ? {
//                             ...material,
//                             quantity: Number(newQuantity),
//                             deliveryDate: String(newDeliveryDate),
//                         }
//                         : material,
//                 ),
//             )
//         }

//         setEditingCell(null)
//         setEditValues((prev) => {
//             const newValues = { ...prev }
//             delete newValues[quantityKey]
//             delete newValues[dateKey]
//             return newValues
//         })
//     }

//     // Cancel edit
//     const cancelEdit = () => {
//         setEditingCell(null)
//         setEditValues({})
//     }

//     // Handle edit value change
//     const handleEditValueChange = (id: string, field: string, value: string | number) => {
//         setEditValues((prev) => ({ ...prev, [`${id}-${field}`]: value }))
//     }

//     const isAllSelected = materials.length > 0 && selectedRows.length === materials.length

//     // Get PR name by sap code
//     const getPRName = (sapCode: string) => {
//         return prNumbers.find((pr) => pr.sap_pr_code === sapCode)?.name || sapCode
//     }

//     return (
//         <div className={cn("space-y-6", className)}>
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-xl font-bold">{title}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {/* PR Multiselect */}
//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">Select Purchase Request Numbers</Label>

//                         {/* Selected PRs Display */}
//                         {selectedPRs.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-3">
//                                 {selectedPRs.map((prCode) => (
//                                     <Badge key={prCode} variant="secondary" className="px-3 py-1">
//                                         {getPRName(prCode)}
//                                         {!disabled && (
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
//                                                 onClick={() => handlePRRemove(prCode)}
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </Button>
//                                         )}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         )}

//                         {/* PR Selection Dropdown */}
//                         {!disabled && (
//                             <Popover open={open} onOpenChange={setOpen}>
//                                 <PopoverTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         role="combobox"
//                                         aria-expanded={open}
//                                         className="w-full justify-between bg-transparent"
//                                         disabled={loading}
//                                     >
//                                         {selectedPRs.length === 0 ? "Select PR Numbers..." : `${selectedPRs.length} PR(s) selected`}
//                                         <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-full p-0">
//                                     <Command>
//                                         <CommandInput placeholder="Search PR numbers..." />
//                                         <CommandList>
//                                             <CommandEmpty>No PR numbers found.</CommandEmpty>
//                                             <CommandGroup>
//                                                 {prNumbers?.map((pr) => (
//                                                     <CommandItem key={pr.sap_pr_code} value={pr.sap_pr_code} onSelect={() => handlePRToggle(pr)}>
//                                                         <Check
//                                                             className={cn(
//                                                                 "mr-2 h-4 w-4",
//                                                                 selectedPRs.includes(pr.sap_pr_code) ? "opacity-100" : "opacity-0",
//                                                             )}
//                                                         />
//                                                         <div className="flex flex-col">
//                                                             <span>{pr.sap_pr_code}</span>
//                                                             {/* <span className="text-xs text-muted-foreground">{pr.name}</span> */}
//                                                         </div>
//                                                     </CommandItem>
//                                                 ))}
//                                             </CommandGroup>
//                                         </CommandList>
//                                     </Command>
//                                 </PopoverContent>
//                             </Popover>
//                         )}
//                     </div>

//                     {/* Loading State */}
//                     {loading && (
//                         <div className="flex items-center justify-center py-8">
//                             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                             <span>Loading materials...</span>
//                         </div>
//                     )}

//                     {/* Materials Table */}
//                     {!loading && materials.length > 0 && (
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-lg font-semibold">Materials List</h3>
//                                 <div className="text-sm text-muted-foreground">
//                                     {selectedRows.length} of {materials.length} items selected
//                                 </div>
//                             </div>

//                             <div className="border rounded-lg overflow-hidden">
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow className="bg-muted/50">
//                                             <TableHead className="w-12">
//                                                 <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} disabled={disabled} />
//                                             </TableHead>
//                                             <TableHead className="w-16">Sr No.</TableHead>
//                                             {/* <TableHead>Type</TableHead> */}
//                                             <TableHead>Requisition No.</TableHead>
//                                             <TableHead>Item Code</TableHead>
//                                             <TableHead className="min-w-[200px]">Item Description</TableHead>
//                                             <TableHead>Quantity</TableHead>
//                                             <TableHead>UOM</TableHead>
//                                             <TableHead>Price</TableHead>
//                                             <TableHead>Delivery Date</TableHead>
//                                             {!disabled && <TableHead className="w-20">Actions</TableHead>}
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {materials.map((material, index) => {
//                                             const isSelected = selectedRows.includes(material.id)
//                                             const isQuantityUpdated = material.quantity !== material.originalQuantity
//                                             const isDateUpdated = material.deliveryDate !== material.originalDeliveryDate
//                                             const isEditing = editingCell?.id === material.id

//                                             return (
//                                                 <TableRow key={index} className={isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""}>
//                                                     <TableCell>
//                                                         <Checkbox
//                                                             checked={isSelected}
//                                                             onCheckedChange={(checked) => handleRowSelect(material.id, checked as boolean)}
//                                                             disabled={disabled}
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell className="font-medium">{index + 1}</TableCell>
//                                                     {/* <TableCell>
//                                                         <Badge variant={material.type === "head" ? "default" : "secondary"}>{material.type}</Badge>
//                                                     </TableCell> */}
//                                                     <TableCell>{material?.requisitionNo}</TableCell>
//                                                     <TableCell className="font-mono text-sm">{material?.itemCode}</TableCell>
//                                                     <TableCell>{material?.itemDescription}</TableCell>

//                                                     {/* Quantity Cell */}
//                                                     <TableCell>
//                                                         {isEditing ? (
//                                                             <Input
//                                                                 type="number"
//                                                                 value={editValues[`${material.id}-quantity`] || material.quantity}
//                                                                 onChange={(e) => handleEditValueChange(material.id, "quantity", e.target.value)}
//                                                                 className="w-20"
//                                                             />
//                                                         ) : (
//                                                             <span className={isQuantityUpdated ? "text-orange-600 font-semibold" : ""}>
//                                                                 {material?.quantity}
//                                                                 {isQuantityUpdated && " *"}
//                                                             </span>
//                                                         )}
//                                                     </TableCell>

//                                                     <TableCell>{material?.uom}</TableCell>
//                                                     <TableCell>₹{material?.price?.toFixed(2)}</TableCell>

//                                                     {/* Delivery Date Cell */}
//                                                     <TableCell>
//                                                         {isEditing ? (
//                                                             <Input
//                                                                 type="date"
//                                                                 value={editValues[`${material.id}-deliveryDate`] || material.deliveryDate}
//                                                                 onChange={(e) => handleEditValueChange(material.id, "deliveryDate", e.target.value)}
//                                                                 className="w-36"
//                                                             />
//                                                         ) : (
//                                                             <span className={isDateUpdated ? "text-orange-600 font-semibold" : ""}>
//                                                                 {material.deliveryDate}
//                                                                 {isDateUpdated && " *"}
//                                                             </span>
//                                                         )}
//                                                     </TableCell>

//                                                     {/* Actions Cell */}
//                                                     {!disabled && (
//                                                         <TableCell>
//                                                             {isEditing ? (
//                                                                 <div className="flex gap-1">
//                                                                     <Button
//                                                                         size="sm"
//                                                                         variant="ghost"
//                                                                         className="h-8 w-8 p-0"
//                                                                         onClick={() => saveEdit(material.id)}
//                                                                     >
//                                                                         <Check className="h-3 w-3" />
//                                                                     </Button>
//                                                                     <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
//                                                                         <X className="h-3 w-3" />
//                                                                     </Button>
//                                                                 </div>
//                                                             ) : (
//                                                                 <Button
//                                                                     size="sm"
//                                                                     variant="ghost"
//                                                                     className="h-8 w-8 p-0"
//                                                                     onClick={() => startEdit(material.id, material.quantity, material.deliveryDate)}
//                                                                     title="Edit Quantity & Delivery Date"
//                                                                     disabled={editingCell !== null}
//                                                                 >
//                                                                     <Edit2 className="h-3 w-3" />
//                                                                 </Button>
//                                                             )}
//                                                         </TableCell>
//                                                     )}
//                                                 </TableRow>
//                                             )
//                                         })}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         </div>
//                     )}

//                     {/* Empty States */}
//                     {!loading && selectedPRs.length === 0 && (
//                         <div className="text-center py-12 text-muted-foreground">
//                             <p className="text-lg">No PR numbers selected</p>
//                             <p className="text-sm">Select PR numbers from the dropdown above to view materials</p>
//                         </div>
//                     )}

//                     {!loading && selectedPRs.length > 0 && materials.length === 0 && (
//                         <div className="text-center py-12 text-muted-foreground">
//                             <p className="text-lg">No materials found</p>
//                             <p className="text-sm">The selected PR numbers don't have any associated materials</p>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }


"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Edit2, Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import API_END_POINTS from "@/src/services/apiEndPoints"
import type { AxiosResponse } from "axios"
import requestWrapper from "@/src/services/apiCall"

export interface PRNumber {
  name: string
  sap_pr_code: string
}

export interface PRItem {
  head_unique_field: string
  requisition_no: string
  material_code_head: string
  material_name_head: string
  quantity_head: number
  uom_head: string
  price_head: number
  delivery_date_head: string
  subhead_unique_field?: string
  material_code_subhead?: string
  material_name_subhead?: string
  quantity_subhead?: number
  uom_subhead?: string
  price_subhead?: number
  delivery_date_subhead?: string
  // Store original values for comparison
  original_quantity_head?: number
  original_delivery_date_head?: string
}

export interface SelectedMaterial extends PRItem {
  isUpdated: boolean
}

interface PRMaterialsManagerProps {
  prNumbers: PRNumber[]
  onSelectionChange?: (selectedMaterials: SelectedMaterial[]) => void
  title?: string
  className?: string
  disabled?: boolean
  apiEndpoint?: string
}

export default function PRMaterialsManager({
  prNumbers,
  onSelectionChange,
  title = "PR Materials Management",
  className = "",
  disabled = false,
  apiEndpoint = "/api/pr-items",
}: PRMaterialsManagerProps) {
  const [selectedPRs, setSelectedPRs] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [materials, setMaterials] = useState<PRItem[]>([])
  const [open, setOpen] = useState(false)
  const [editValues, setEditValues] = useState<{ [key: string]: string | number }>({})
  const [loading, setLoading] = useState(false)

  // Fetch materials when selected PRs change
  const fetchMaterials = useCallback(async (prCodes: string[]) => {
    if (prCodes.length === 0) {
      setMaterials([])
      return
    }

    setLoading(true)
    try {
      console.log(prCodes, "prCodes before API call")
      const url = `${API_END_POINTS?.fetchPRItems}`
      const response: AxiosResponse = await requestWrapper({
        url: url,
        data: { data: { pr_numbers: prCodes } },
        method: "POST",
      })

      if (response?.status == 200) {
        console.log(response.data.message.pr_items, "API response pr_items")

        // Add original values for comparison and ensure unique IDs
        const materialsWithOriginals = response.data.message.pr_items.map((item: PRItem) => ({
          ...item,
          original_quantity_head: item.quantity_head,
          original_delivery_date_head: item.delivery_date_head,
          // Ensure unique ID exists
          head_unique_field:
            item.head_unique_field || `${item.requisition_no}_${item.material_code_head}_${Date.now()}`,
        }))

        setMaterials(materialsWithOriginals)
        console.log(materialsWithOriginals, "processed materials")
      } else {
        alert("Error fetching materials")
        setMaterials([])
      }
    } catch (error) {
      console.error("Error fetching PR items:", error)
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Update materials when selected PRs change
  useEffect(() => {
    fetchMaterials(selectedPRs)
  }, [selectedPRs, fetchMaterials])

  // Get selected materials with update status
  const selectedMaterials = useMemo(() => {
    const selected = materials
      .filter((material) => selectedRows.includes(material.head_unique_field))
      .map((material) => ({
        ...material,
        isUpdated:
          material.quantity_head !== material.original_quantity_head ||
          material.delivery_date_head !== material.original_delivery_date_head,
      }))
    return selected
  }, [materials, selectedRows])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedMaterials)
  }, [selectedMaterials, onSelectionChange])

  // Handle PR selection/deselection
  const handlePRToggle = (prNumber: PRNumber) => {
    if (disabled) return

    setSelectedPRs((prev) => {
      if (prev.includes(prNumber.sap_pr_code)) {
        // Remove PR and its selected rows
        const newPRs = prev.filter((pr) => pr !== prNumber.sap_pr_code)
        // Remove selected rows that belong to this PR
        setSelectedRows((current) =>
          current.filter((id) => {
            const material = materials.find((m) => m.head_unique_field === id)
            return material && newPRs.includes(material.requisition_no)
          }),
        )
        return newPRs
      } else {
        // Add PR
        return [...prev, prNumber.sap_pr_code]
      }
    })
  }

  // Handle PR removal from badge
  const handlePRRemove = (prCode: string) => {
    if (disabled) return

    setSelectedPRs((prev) => {
      const newPRs = prev.filter((pr) => pr !== prCode)
      // Remove selected rows that belong to this PR
      setSelectedRows((current) =>
        current.filter((id) => {
          const material = materials.find((m) => m.head_unique_field === id)
          return material && newPRs.includes(material.requisition_no)
        }),
      )
      return newPRs
    })
  }

  // Handle row selection
  const handleRowSelect = (materialId: string, checked: boolean) => {
    if (disabled) return

    setSelectedRows((prev) => {
      if (checked) {
        return [...prev, materialId]
      } else {
        return prev.filter((id) => id !== materialId)
      }
    })
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (disabled) return

    if (checked) {
      setSelectedRows(materials.map((material) => material.head_unique_field))
    } else {
      setSelectedRows([])
    }
  }

  // Start editing
  const startEdit = (id: string, currentQuantity: number, currentDeliveryDate: string) => {
    if (disabled) return

    setEditingCell({ id, field: "both" })
    setEditValues({
      [`${id}-quantity`]: currentQuantity,
      [`${id}-deliveryDate`]: currentDeliveryDate,
    })
  }

  // Save edit
  const saveEdit = (id: string) => {
    if (disabled) return

    const quantityKey = `${id}-quantity`
    const dateKey = `${id}-deliveryDate`
    const newQuantity = editValues[quantityKey]
    const newDeliveryDate = editValues[dateKey]

    if (newQuantity !== undefined && newDeliveryDate !== undefined) {
      setMaterials((prev) =>
        prev.map((material) =>
          material.head_unique_field === id
            ? {
                ...material,
                quantity_head: Number(newQuantity),
                delivery_date_head: String(newDeliveryDate),
              }
            : material,
        ),
      )
    }

    setEditingCell(null)
    setEditValues((prev) => {
      const newValues = { ...prev }
      delete newValues[quantityKey]
      delete newValues[dateKey]
      return newValues
    })
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingCell(null)
    setEditValues({})
  }

  // Handle edit value change
  const handleEditValueChange = (id: string, field: string, value: string | number) => {
    setEditValues((prev) => ({ ...prev, [`${id}-${field}`]: value }))
  }

  const isAllSelected = materials.length > 0 && selectedRows.length === materials.length

  // Get PR name by sap code
  const getPRName = (sapCode: string) => {
    return prNumbers.find((pr) => pr.sap_pr_code === sapCode)?.name || sapCode
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PR Multiselect */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Purchase Request Numbers</Label>

            {/* Selected PRs Display */}
            {selectedPRs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedPRs.map((prCode) => (
                  <Badge key={prCode} variant="secondary" className="px-3 py-1">
                    {getPRName(prCode)}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handlePRRemove(prCode)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            {/* PR Selection Dropdown */}
            {!disabled && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                    disabled={loading}
                  >
                    {selectedPRs.length === 0 ? "Select PR Numbers..." : `${selectedPRs.length} PR(s) selected`}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search PR numbers..." />
                    <CommandList>
                      <CommandEmpty>No PR numbers found.</CommandEmpty>
                      <CommandGroup>
                        {prNumbers?.map((pr) => (
                          <CommandItem key={pr.sap_pr_code} value={pr.sap_pr_code} onSelect={() => handlePRToggle(pr)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPRs.includes(pr.sap_pr_code) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{pr.sap_pr_code}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading materials...</span>
            </div>
          )}

          {/* Materials Table */}
          {!loading && materials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Materials List</h3>
                <div className="text-sm text-muted-foreground">
                  {selectedRows.length} of {materials.length} items selected
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} disabled={disabled} />
                      </TableHead>
                      <TableHead className="w-16">Sr No.</TableHead>
                      <TableHead>Requisition No.</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead className="min-w-[200px]">Item Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      {!disabled && <TableHead className="w-20">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material, index) => {
                      const isSelected = selectedRows.includes(material.head_unique_field)
                      const isQuantityUpdated = material.quantity_head !== material.original_quantity_head
                      const isDateUpdated = material.delivery_date_head !== material.original_delivery_date_head
                      const isEditing = editingCell?.id === material.head_unique_field

                      return (
                        <TableRow
                          key={material.head_unique_field}
                          className={isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleRowSelect(material.head_unique_field, checked as boolean)
                              }
                              disabled={disabled}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{material?.requisition_no}</TableCell>
                          <TableCell className="font-mono text-sm">{material?.material_code_head}</TableCell>
                          <TableCell>{material?.material_name_head}</TableCell>

                          {/* Quantity Cell */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editValues[`${material.head_unique_field}-quantity`] || material.quantity_head}
                                onChange={(e) =>
                                  handleEditValueChange(material.head_unique_field, "quantity", e.target.value)
                                }
                                className="w-20"
                              />
                            ) : (
                              <span className={isQuantityUpdated ? "text-orange-600 font-semibold" : ""}>
                                {material?.quantity_head}
                                {isQuantityUpdated && " *"}
                              </span>
                            )}
                          </TableCell>

                          <TableCell>{material?.uom_head}</TableCell>
                          <TableCell>₹{material?.price_head}</TableCell>

                          {/* Delivery Date Cell */}
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={
                                  editValues[`${material.head_unique_field}-deliveryDate`] ||
                                  material.delivery_date_head
                                }
                                onChange={(e) =>
                                  handleEditValueChange(material.head_unique_field, "deliveryDate", e.target.value)
                                }
                                className="w-36"
                              />
                            ) : (
                              <span className={isDateUpdated ? "text-orange-600 font-semibold" : ""}>
                                {material.delivery_date_head}
                                {isDateUpdated && " *"}
                              </span>
                            )}
                          </TableCell>

                          {/* Actions Cell */}
                          {!disabled && (
                            <TableCell>
                              {isEditing ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => saveEdit(material.head_unique_field)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    startEdit(
                                      material.head_unique_field,
                                      material.quantity_head,
                                      material.delivery_date_head,
                                    )
                                  }
                                  title="Edit Quantity & Delivery Date"
                                  disabled={editingCell !== null}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Empty States */}
          {!loading && selectedPRs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No PR numbers selected</p>
              <p className="text-sm">Select PR numbers from the dropdown above to view materials</p>
            </div>
          )}

          {!loading && selectedPRs.length > 0 && materials.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No materials found</p>
              <p className="text-sm">The selected PR numbers don't have any associated materials</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
