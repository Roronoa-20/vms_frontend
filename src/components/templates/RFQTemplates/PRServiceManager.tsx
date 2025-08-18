"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Edit2, Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import API_END_POINTS from "@/src/services/apiEndPoints"
import type { AxiosResponse } from "axios"
import requestWrapper from "@/src/services/apiCall"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SubheadField } from "@/src/types/PurchaseRequisitionType"
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
  original_quantity_head?: number
  original_delivery_date_head?: string
  subhead_fields: SubheadField[];
}

export interface SelectedMaterial extends SubheadField {
  isUpdated: boolean
}

interface PRMaterialsManagerProps {
  prNumbers: PRNumber[]
  onSelectionChange?: (selectedMaterials: SelectedMaterial[]) => void
  title?: string
  className?: string
  disabled?: boolean
}

export default function PRServiceManager({
  prNumbers,
  onSelectionChange,
  title = "PR Materials Management",
  className = "",
  disabled = false,
}: PRMaterialsManagerProps) {
  const [selectedPRs, setSelectedPRs] = useState<string[]>([])
  const [materials, setMaterials] = useState<PRItem[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSubheads, setSelectedSubheads] = useState<string[]>([])
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  // Fetch materials when selected PRs change

  const fetchMaterials = useCallback(async (prCodes: string[]) => {
    if (prCodes.length === 0) {
      setMaterials([]);
      return;
    }
    setLoading(true);
    try {
      const url = `${API_END_POINTS?.fetchPRItems}`;
      const response: AxiosResponse = await requestWrapper({
        url: url,
        data: { data: { pr_numbers: prCodes } },
        method: "POST",
      });

      if (response?.status === 200) {
        const materialsWithOriginals = response.data.message.pr_items.map((item: PRItem) => {
          const head_unique_field =
            item.head_unique_field ||
            `${item.requisition_no}_${item.material_code_head}_${Date.now()}`;

          // Process subheads with originals and unique keys
          const subheadWithOriginals = item.subhead_fields?.map((sub, idx) => ({
            ...sub,
            original_quantity: sub.quantity_subhead,
            original_delivery_date: sub.delivery_date_subhead,
            sub_unique_field:
              sub.sub_head_unique_id ||
              `${head_unique_field}_sub_${sub.material_name_subhead}_${sub.delivery_date_subhead}_${idx}`,
          })) || [];

          return {
            ...item,
            head_unique_field,
            subhead_fields: subheadWithOriginals,
          };
        });

        setMaterials(materialsWithOriginals);
      } else {
        alert("Error fetching materials");
        setMaterials([]);
      }
    } catch (error) {
      console.error("Error fetching PR items:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update materials when selected PRs change
  useEffect(() => {
    fetchMaterials(selectedPRs)
  }, [selectedPRs, fetchMaterials])
  const selectedMaterials = useMemo(() => {
    const selected = materials
      .map((material) => {
        const filteredSubheads = (material.subhead_fields || []).filter((sub) =>
          selectedSubheads.includes(sub.subhead_unique_field)
        );

        if (filteredSubheads.length === 0) return null;

        return {
          row_id: filteredSubheads[0].row_id || "",
          head_unique_field: material.head_unique_field,
          requisition_no: material.requisition_no,
          material_code_head: material.material_code_head,
          material_name_head: material.material_name_head,
          quantity_head: String(material.quantity_head),
          uom_head: material.uom_head,
          price_head: String(material.price_head),
          delivery_date_head: material.delivery_date_head,
          plant_head: (material as any).plant_head || "",

          // Add required fields
          isUpdated: false,
          row_name: "",
          sub_head_unique_id: "",
          purchase_requisition_item_subhead: "",
          // Fill all other missing required fields with defaults if needed

          subhead_fields: filteredSubheads.map((sub) => ({
            ...sub,
            isUpdated:
              sub.quantity_subhead !== sub.original_quantity ||
              sub.delivery_date_subhead !== sub.original_delivery_date,
          })),
        };
      })
      .filter((item): item is Exclude<typeof item, null> => item !== null);

    // 👇 Force-cast to SelectedMaterial[]
    return selected as unknown as SelectedMaterial[];
  }, [materials, selectedSubheads]);




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
      return newPRs
    })
  }
  // Get PR name by sap code
  const getPRName = (sapCode: string) => {
    return prNumbers.find((pr) => pr.sap_pr_code === sapCode)?.name || sapCode
  }


  const isHeadSelected = (head: PRItem) => {
    const subIds = head.subhead_fields.map((sub) => sub.subhead_unique_field);
    return subIds.every((id) => selectedSubheads.includes(id));
  };

  const toggleHeadSelection = (head: PRItem, checked: boolean) => {
    const subIds = head.subhead_fields.map((sub) => sub.subhead_unique_field);
    setSelectedSubheads((prev) => {
      if (checked) {
        // Add all subhead IDs
        return [...prev, ...subIds.filter((id) => !prev.includes(id))];
      } else {
        // Remove all subhead IDs
        return prev.filter((id) => !subIds.includes(id));
      }
    });
  };


  const handleEditValueChange = (id: string, field: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [`${id}-${field}`]: value,
    }))
  }

  //new updated
  const saveEdit = (headId: string, subId: string) => {
    const quantityKey = `${subId}-quantity`;
    const dateKey = `${subId}-delivery`;

    const newQuantity = editValues[quantityKey];
    const newDeliveryDate = editValues[dateKey];

    if (newQuantity !== undefined && newDeliveryDate !== undefined) {
      setMaterials((prev) =>
        prev.map((material) => {
          if (material.head_unique_field === headId) {
            return {
              ...material,
              subhead_fields: material.subhead_fields?.map((sub) =>
                sub.subhead_unique_field === subId
                  ? {
                    ...sub,
                    quantity_subhead: String(newQuantity),
                    delivery_date_subhead: String(newDeliveryDate),
                  }
                  : sub
              ),
            };
          }
          return material;
        })
      );
    }

    setEditingRow(null);

    // Clean up edit values
    setEditValues((prev) => {
      const newValues = { ...prev };
      delete newValues[quantityKey];
      delete newValues[dateKey];
      return newValues;
    });
  };

  const startEdit = (id: string, quantity: string, delivery: string) => {
    setEditingRow(id)
    setEditValues({
      [`${id}-quantity`]: quantity,
      [`${id}-delivery`]: delivery,
    })
  }

  const cancelEdit = () => {
    setEditValues({})
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
            {/* <Label className="text-sm font-medium">Select Purchase Request Numbers</Label> */}

            {/* Selected PRs Display */}
            {selectedPRs?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedPRs?.map((prCode) => (
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
                    {selectedPRs?.length === 0 ? "Select PR Numbers..." : `${selectedPRs?.length} PR(s) selected`}
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
                          <CommandItem key={pr?.name} value={pr?.sap_pr_code} onSelect={() => {
                            handlePRToggle(pr)
                            setOpen(false)
                          }}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 ",
                                selectedPRs?.includes(pr?.sap_pr_code) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{pr?.name}</span>
                              <span className="text-xs">{pr?.sap_pr_code}</span>
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
          {!loading && materials?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Services List</h3>
                <div className="text-sm text-muted-foreground">
                  {selectedSubheads?.length} of {materials.length} items selected
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Accordion type="multiple" className="w-full space-y-4">
                  {materials?.map((head, index) => (

                    <AccordionItem
                      key={head.head_unique_field}
                      value={head.head_unique_field}
                      className="rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
                    >
                      {/* Trigger moved to a separate arrow button */}
                      <div className="flex items-center gap-4 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">

                        {/* Checkbox - now safely outside <button> */}
                        <Checkbox
                          checked={isHeadSelected(head)}
                          onCheckedChange={(checked) => toggleHeadSelection(head, checked as boolean)}
                        />

                        {/* Main info block */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-left text-sm md:text-base">
                          <div><strong>Requisition No.</strong>: {head.requisition_no || "N/A"}</div>
                          <div><strong>Service Name</strong>: {head.material_name_head || "Unnamed"}</div>
                          <div><strong>Service Code</strong>: {head.material_code_head || "N/A"}</div>
                          <div><strong>Price</strong>: ₹{head.price_head || "0"}</div>
                          <div><strong>Quantity</strong>: {head.quantity_head}</div>
                          <div><strong>UOM</strong>: {head.uom_head || "N/A"}</div>
                          <div><strong>Delivery Date</strong>: {head.delivery_date_head || "N/A"}</div>
                        </div>

                        {/* Accordion toggle arrow only */}
                        <AccordionTrigger className="ml-auto w-6 h-6" />
                      </div>

                      <AccordionContent className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50 text-xs md:text-sm">
                              <TableHead>Service Name</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>UOM</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Delivery Date</TableHead>
                              <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {head?.subhead_fields.map((sub) => {
                              const isEditing = editingRow === sub.subhead_unique_field
                              const isSelected = selectedSubheads.includes(sub.subhead_unique_field)

                              return (
                                <TableRow key={sub.subhead_unique_field} className="text-sm">
                                  <TableCell>{sub.material_name_subhead}</TableCell>
                                  <TableCell>
                                    {isEditing ? (
                                      <Input
                                        type="number"
                                        value={editValues[`${sub.subhead_unique_field}-quantity`] || sub.quantity_subhead}
                                        onChange={(e) =>
                                          handleEditValueChange(sub.subhead_unique_field, "quantity", e.target.value)
                                        }
                                        className="w-20"
                                      />
                                    ) : (
                                      sub.quantity_subhead
                                    )}
                                  </TableCell>
                                  <TableCell>{sub.uom_subhead}</TableCell>
                                  <TableCell>₹{sub.price_subhead}</TableCell>
                                  <TableCell>
                                    {isEditing ? (
                                      <Input
                                        type="date"
                                        value={
                                          editValues[`${sub.subhead_unique_field}-delivery`] || sub.delivery_date_subhead
                                        }
                                        onChange={(e) =>
                                          handleEditValueChange(sub.subhead_unique_field, "delivery", e.target.value)
                                        }
                                        className="w-36"
                                      />
                                    ) : (
                                      sub.delivery_date_subhead
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {isEditing ? (
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="px-2"
                                          onClick={() => saveEdit(head.head_unique_field, sub?.subhead_unique_field)}
                                          title="Save"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="px-2"
                                          onClick={cancelEdit}
                                          title="Cancel"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1"
                                        onClick={() =>
                                          startEdit(sub.subhead_unique_field, sub.quantity_subhead, sub.delivery_date_subhead)
                                        }
                                        disabled={editingRow !== null}
                                        title="Edit"
                                      >
                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}

          {/* Empty States */}
          {!loading && selectedPRs?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No PR numbers selected</p>
              <p className="text-sm">Select PR numbers from the dropdown above to view materials</p>
            </div>
          )}
          {!loading && selectedPRs?.length > 0 && materials.length === 0 && (
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

