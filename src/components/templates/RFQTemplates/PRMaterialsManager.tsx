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
  defaultPRCodes?:string[]
}

export default function PRMaterialsManager({
  prNumbers,
  onSelectionChange,
  title = "PR Materials Management",
  className = "",
  disabled = false,
  defaultPRCodes
}: PRMaterialsManagerProps) {
  const [selectedPRs, setSelectedPRs] = useState<string[]>(defaultPRCodes?defaultPRCodes:[])
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
      const url = `${API_END_POINTS?.fetchPRItems}`
      const response: AxiosResponse = await requestWrapper({
        url: url,
        data: { data: { pr_numbers: prCodes } },
        method: "POST",
      })

      if (response?.status == 200) {
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
    return prNumbers.find((pr) => pr?.sap_pr_code === sapCode)?.name || sapCode
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
                          <CommandItem key={pr?.sap_pr_code} value={pr?.sap_pr_code} onSelect={() => { handlePRToggle(pr) 
                            setOpen(false)}}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPRs.includes(pr?.sap_pr_code) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{pr?.sap_pr_code}</span>
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
                <h3 className="text-lg font-semibold">Materials List</h3>
                <div className="text-sm text-muted-foreground">
                  {selectedRows?.length} of {materials?.length} items selected
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
                    {materials?.map((material, index) => {
                      const isSelected = selectedRows.includes(material.head_unique_field)
                      const isQuantityUpdated = material.quantity_head !== material.original_quantity_head
                      const isDateUpdated = material.delivery_date_head !== material.original_delivery_date_head
                      const isEditing = editingCell?.id === material.head_unique_field

                      return (
                        <TableRow
                          key={material?.head_unique_field}
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
                                value={editValues[`${material?.head_unique_field}-quantity`] || material?.quantity_head}
                                onChange={(e) =>
                                  handleEditValueChange(material?.head_unique_field, "quantity", e.target.value)
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
