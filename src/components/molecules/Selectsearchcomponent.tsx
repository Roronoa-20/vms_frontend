

'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"

type Props<T> = {
    setData?: (value: string | null) => void;         // for single-select
    data?: string | null;                             // for single-select
    selectedItems?: T[];                              // for multi-select
    setSelectedItems?: (items: T[]) => void;         // for multi-select
    dropdown: T[];
    setDropdown?: (value: T[]) => void;
    placeholder?: string;
    getLabel: (item: T) => string;
    getValue: (item: T) => string;
    searchApi?: (query: string) => Promise<T[]>;
    customSearchFn?: (items: T[], query: string) => T[];
    disabled?: boolean;
    mode?: "single" | "multiple";
    /** Merged onto the trigger button (e.g. compact PR tables). */
    triggerClassName?: string;
}

const SearchSelectComponent = <T extends object>({
    setData,
    data,
    selectedItems = [],
    setSelectedItems,
    dropdown,
    setDropdown,
    getLabel,
    getValue,
    searchApi,
    customSearchFn,
    disabled = false,
    placeholder,
    mode = "single",
    triggerClassName,
}: Props<T>) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [dataLabel, setDataLabel] = useState<string | null>('');
    const [filteredDropdown, setFilteredDropdown] = useState<T[]>([]);
    const [maxCharacters, setMaxCharacters] = useState<number | null>(2);
    
    const buttonRef = useRef<HTMLButtonElement>(null);

    const listToShow = searchApi ? dropdown : filteredDropdown;

    const truncate = (label: string | null) => {
        if (!label) return '';
        if (maxCharacters === null || label?.length <= maxCharacters) return label;
        return label?.toString()?.length < maxCharacters ? label : `${label?.toString()?.substring(0, maxCharacters)}...`;
    }

    // Render button label
    const renderButtonLabel = () => {
        if (mode === "multiple") {
            if (!selectedItems || selectedItems.length === 0) return placeholder || "Select...";
            return (
                <div className="flex flex-wrap gap-2 max-w-full h-full overflow-auto hide-scrollbar">
                    {selectedItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-200 rounded px-2 py-1">
                            {getLabel(dropdown?.find(i => getValue(i) === getValue(item)) || item)}
                            <span
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newSelected = selectedItems.filter(i => getValue(i) !== getValue(item));
                                    setSelectedItems?.(newSelected);
                                }}
                            >
                                ✕
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else {
            return data && dropdown?.length > 0 ? truncate(dataLabel) : placeholder ? <div className="text-[#9ca3af]">{truncate(placeholder)}</div> : <div className="text-[#9ca3af]">{truncate("Select...")}</div>;
        }
    }

    // Handle item click
    const handleItemClick = (item: T) => {
        if (mode === "multiple") {
            const exists = selectedItems.some(i => getValue(i) === getValue(item));
            if (exists) {
                setSelectedItems?.(selectedItems.filter(i => getValue(i) !== getValue(item)));
            } else {
                setSelectedItems?.([...selectedItems, item]);
            }
        } else {
            setDataLabel(getLabel(item));
            setData?.(getValue(item));
            setOpen(false);
        }
    }

    // Fetch API results if searchApi exists
    useEffect(() => {
        if (searchApi) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const results = await searchApi(searchQuery);
                    if(setDropdown) setDropdown(results);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    if(setDropdown) setDropdown([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [searchQuery]);

    // Reset selected data if dropdown is empty (single-select)
    useEffect(() => {
        const shouldReset = !searchApi && dropdown?.length === 0 && (data !== null || dataLabel !== null);
        if (shouldReset) {
            if (data !== null) setData?.(null);
            if (dataLabel !== null) setDataLabel(null);
        }
    }, [dropdown?.length]);

    // Local filtering
    useEffect(() => {
        if (!searchApi) {
            if (customSearchFn) {
                const filtered = customSearchFn(dropdown, searchQuery);
                setFilteredDropdown(filtered);
            } else {
                let filtered = dropdown?.filter(item =>
                    searchQuery?.length > 2 || searchQuery?.trim() === "" ?
                    getLabel(item)?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase())
                    :
                    getLabel(item)?.toString()?.toLowerCase()?.startsWith(searchQuery?.toLowerCase())
                );

                if(filtered?.length <= 0) {
                    filtered = dropdown?.filter(item => getLabel(item)?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
                }
                setFilteredDropdown(filtered);
            }
        }
    }, [searchQuery, dropdown, customSearchFn]);

    // Resize observer for truncation
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (buttonRef?.current) {
                const buttonWidth = buttonRef?.current?.offsetWidth;
                const approxCharWidth = 10;
                const paddingAndIcons = 40;
                const availableWidth = buttonWidth - paddingAndIcons;
                const chars = Math.floor(availableWidth / approxCharWidth);
                setMaxCharacters(chars);
            }
        });

        if (buttonRef?.current) resizeObserver?.observe(buttonRef?.current);

        return () => resizeObserver?.disconnect();
    }, []);

    // Update dataLabel when data changes (single-select)
    useEffect(() => {
        if (data && dropdown?.length > 0) {
            const match = dropdown?.find((item) => getValue(item) === data);
            if (match) setDataLabel(getLabel(match));
        }
    }, [data, dropdown]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className='relative'>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={`${mode === "multiple" ? "h-fit max-h-[150px]" : "w-full" } relative justify-between shadow border hover:shadow-md active:shadow-lg lg:text-sm rounded-lg gap-[9px] text-[9px] font-normal ${disabled && "cursor-pointer"}`}
                >
                    {renderButtonLabel()}
                    {!open ? 
                        <ChevronDown className='ml-1 h-3.5 w-3.5 shrink-0 opacity-50' />
                        :
                        <ChevronUp className='ml-1 h-3.5 w-3.5 shrink-0 opacity-50' />
                    }
                </Button>
            </PopoverTrigger>

            <PopoverContent className={`p-0 bg-white text-black font-normal`} style={{ width: buttonRef?.current?.offsetWidth }}>
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchQuery(e?.target?.value)
                        }
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center w-full pt-2">
                                <LoaderCircle className="mr-2 h-7 w-7 animate-spin text-blue-500" />
                            </div>
                        )}
                        {(!listToShow || listToShow?.length === 0) && (
                            <div className="p-4 flex items-center justify-center">
                                No options found.
                            </div>
                        )}
                        <div className="max-h-60 overflow-y-auto">
                            {listToShow?.sort((a, b) => getLabel(a).toLowerCase().localeCompare(getLabel(b).toLowerCase()))
                                .map((item) => (
                                <div
                                    className="cursor-pointer flex items-center p-2 hover:bg-gray-100 text-[14px] text-black"
                                    key={getValue(item)}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            (mode === "multiple" ? selectedItems.some(i => getValue(i) === getValue(item)) : data === getValue(item)) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {getLabel(item)}
                                </div>
                            ))}
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SearchSelectComponent;