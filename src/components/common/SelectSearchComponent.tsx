'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"

type Props<T> = {
    setData: (value: string | null) => void;
    data: string | null;
    dropdown: T[];
    setDropdown: (value: T[]) => void;
    placeholder?: string;
    getLabel: (item: T) => string;
    getValue: (item: T) => string;
    searchApi?: (query: string) => Promise<T[]>;
    disabled?:boolean;
}

const SearchSelectComponent = <T extends object>({
    setData,
    data,
    dropdown,
    setDropdown,
    getLabel,
    getValue,
    searchApi,
    placeholder,
    disabled=false
}: Props<T>) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataLabel, setDataLabel] = useState<string | null>('');
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredDropdown, setFilteredDropdown] = useState<T[]>([]);
    const [maxCharacters, setMaxCharacters] = useState<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (searchApi) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const results = await searchApi(searchQuery);
                    setDropdown(results);
                } catch (error) {
                    console?.error('Error fetching search results:', error);
                    setDropdown([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [searchQuery]);

    useEffect(() => {
        const shouldReset = !searchApi && dropdown?.length === 0 && (data !== null || dataLabel !== null);
        if (shouldReset) {
            if (data !== null) setData(null);
            if (dataLabel !== null) setDataLabel(null);
        }
    }, [dropdown?.length]);


    useEffect(() => {
        if (!searchApi) {
            const filtered = dropdown?.filter(item =>
                getLabel(item).toLowerCase().includes(searchQuery?.toLowerCase())
            );
            setFilteredDropdown(filtered);
        }
    }, [searchQuery, dropdown]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (buttonRef.current) {
                const buttonWidth = buttonRef.current.offsetWidth;
                const approxCharWidth = 10;
                const paddingAndIcons = 40;
                const availableWidth = buttonWidth - paddingAndIcons;
                const chars = Math.floor(availableWidth / approxCharWidth);
                setMaxCharacters(chars);
            }
        });

        if (buttonRef.current) {
            resizeObserver.observe(buttonRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const truncate = (label: string | null) => {
        if (!label) return '';
        if (maxCharacters === null || label.length <= maxCharacters) return label;
        return `${label.substring(0, maxCharacters)}...`;
    }

    useEffect(() => {
        if (data && dropdown.length > 0) {
            const match = dropdown.find((item) => getValue(item) === data);
            if (match) {
            setDataLabel(getLabel(match));
            }
        }
    }, [data, dropdown]);


    const listToShow = searchApi ? dropdown : filteredDropdown;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className='relative'>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full relative justify-between border active:shadow-lg lg:text-sm rounded-md gap-[9px] text-[9px] font-normal"
                >
                    {data && dropdown?.length > 0 ? truncate(dataLabel) : placeholder && placeholder.trim() !== "" ? <div className="text-[#9ca3af]">{truncate(placeholder)}</div> : <div className="text-[#9ca3af]">{truncate("Select...")}</div>}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>

            <PopoverContent className={`p-0 bg-white text-black font-normal`} style={{ width: buttonRef.current?.offsetWidth }}>
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchQuery(e.target.value)
                        }
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center w-full pt-2">
                                <LoaderCircle className="mr-2 h-7 w-7 animate-spin text-blue-500" />
                            </div>
                        )}
                        {(!listToShow || listToShow.length === 0) && (
                            <div className="p-4 flex items-center justify-center">
                                No options found.
                            </div>
                        )}
                        <div className="max-h-60 overflow-y-auto">
                            {listToShow?.map((item) => (
                                <div
                                    className="cursor-pointer flex items-center p-2 hover:bg-gray-100 text-[14px] text-black"
                                    key={getValue(item)}
                                    id={getValue(item)}
                                    data-name={getLabel(item)}
                                    onClick={(currentValue) => {
                                        setDataLabel(currentValue?.currentTarget?.dataset?.name ?? null);
                                        setData(currentValue?.currentTarget?.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            data === getValue(item) ? "opacity-100" : "opacity-0"
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