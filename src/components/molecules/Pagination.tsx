import React from 'react';
import { Button } from '@/components/ui/button';

type props = {
  currentPage: number,
  setCurrentPage: (value: number) => void,
  total_event_list: number,
  record_per_page: number,
}

export default function Pagination({ ...Props }: props) {
  // const [perPage, setPerPage] = useState<number>(Props?.record_per_page);
  // const total_pages = Math.ceil((Props?.total_event_list / 10))
  const total_pages = Math.ceil(Props.total_event_list / Props.record_per_page);

  // const [totalPages, setTotalPages] = useState<number>(Math.ceil((Props?.total_event_list / 10)));

  const handlePrev = async () => {
    if (Props.currentPage > 1) {
      Props.setCurrentPage(Props.currentPage - 1);
      // createQueryString("page", (currentPage-1).toString());
    }

  };
  const handleNext = async () => {
    Props.setCurrentPage(Props.currentPage + 1);
    // createQueryString("page", (currentPage+1).toString());
  };

  // console.log("currentPage:", Props.currentPage);
  // console.log("total_event_list:", Props.total_event_list);
  // console.log("record_per_page:", Props.record_per_page);
  // console.log("total_pages:", Math.ceil(Props.total_event_list / Props.record_per_page));
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs font-normal">Showing {(Props.currentPage - 1) * Props.record_per_page + 1} to {Math.min(Props.currentPage * Props.record_per_page, Props.total_event_list)} of {Props.total_event_list} entries</p>
        {/* <p className="text-gray-500 text-xs font-normal">Showing {(Props.currentPage - 1) * 10 + 1} to {(Props.currentPage -1 ) *(10) + Props?.record_per_page} of {Props.total_event_list} entries</p> */}
      </div>
      <div className="flex items-center space-x-2 pt-4">
        <Button onClick={handlePrev} variant="backbtn" size="backbtnsize" className={`py-2 ${Props.currentPage == 1 ? 'cursor-not-allowed disabled bg-opacity-50' : ''}`} disabled={Props.currentPage == 1 ? true : false}>
          Previous
        </Button>
        <Button onClick={handleNext} variant="nextbtn" size="nextbtnsize" className={`py-2 ${Props.currentPage == total_pages || (Props.total_event_list == 0) ? 'cursor-not-allowed' : ''}`} disabled={Props.currentPage == total_pages || (Props.total_event_list == 0) ? true : false}>
          Next
        </Button>
      </div>
    </div>
  )
}

