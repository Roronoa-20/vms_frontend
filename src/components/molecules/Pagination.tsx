import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type props = {
  currentPage: number,
  setCurrentPage: (value: number) => void,
  total_event_list: number,
  record_per_page: number,
}

export default function Pagination({ ...Props }: props) {
  const total_pages = Math.ceil(Props.total_event_list / Props.record_per_page);
  const isFirstPage = Props.currentPage <= 1;
  const isLastPage = Props.currentPage >= total_pages || Props.total_event_list === 0;

  const handlePrev = () => {
    if (!isFirstPage) Props.setCurrentPage(Props.currentPage - 1);
  };
  const handleNext = () => {
    if (!isLastPage) Props.setCurrentPage(Props.currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <p className="text-[11px] text-[#94A3B8] font-medium tabular-nums">
        Showing {(Props.currentPage - 1) * Props.record_per_page + 1} to {Math.min(Props.currentPage * Props.record_per_page, Props.total_event_list)} of {Props.total_event_list} entries
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstPage}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Prev
        </button>
        <span className="inline-flex items-center justify-center min-w-[28px] rounded-lg bg-[#EEF2FF] px-2 py-1.5 text-xs font-bold text-[#4F6BED] tabular-nums">
          {Props.currentPage}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={isLastPage}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

