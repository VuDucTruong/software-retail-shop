import {
  Pagination,
  PaginationContent,
  PaginationEnd,
  PaginationItem,
  PaginationLink,
  PaginationStart
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import {usePathname, useSearchParams} from "next/navigation";

type Props = {
    totalPages: number;
    currentPage: number;
}

export default function SearchPagination(props: Props) {
  const { totalPages, currentPage } = props;
  
    const pageIndexes = calculatePageIndexes(totalPages, currentPage);

  return (
    <Pagination>
        
        <PaginationContent>
            <div className='border border-border rounded-md px-4 py-2 hover:border-primary transition-all duration-200'>
                Trang {currentPage + 1} / {totalPages}
            </div>
          <PaginationItem >
            <PaginationStart disabled href="?page=0" />
          </PaginationItem>
          {
            pageIndexes.map((val , ) => (
              <PaginationItem key={val}>
                <PaginationLink
                  href={`?page=${val}`}
                  isActive={currentPage === val}
                >
                  {val + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          }
          <PaginationItem hidden={currentPage == totalPages - 1}>
            <PaginationEnd  href={`?page=${totalPages - 1}`}  />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  )
}

function makePageHref(page: number, searchParams: URLSearchParams, pathname: string) {
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  return `${pathname}?${params.toString()}`;
}


export function SearchBlogPagination({ totalPages, currentPage }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageIndexes = calculatePageIndexes(totalPages, currentPage);

  return (
    <Pagination>
      <PaginationContent>
        <div className="border border-border rounded-md px-4 py-2 hover:border-primary transition-all duration-200">
          Trang {currentPage + 1} / {totalPages}
        </div>
        <PaginationItem>
          <PaginationStart disabled={currentPage === 0} href={makePageHref(0, searchParams, pathname)} />
        </PaginationItem>
        {pageIndexes.map((val) => {
          const isActive = currentPage === val;
          return (
            <PaginationItem key={val}>
              <Button variant={isActive ? 'default' : 'ghost'}>
                <Link
                  href={makePageHref(val, searchParams, pathname)}
                  aria-current={isActive ? 'page' : undefined}
                  data-slot="pagination-link"
                  data-active={isActive}
                >
                  {val + 1}
                </Link>
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem hidden={currentPage === totalPages - 1}>
          <PaginationEnd href={makePageHref(totalPages - 1, searchParams, pathname)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}



const calculatePageIndexes = (totalPages: number, currentPage: number):number[] => {
    const pageIndexes = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages;
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(0, endPage - maxVisiblePages);
    }
    
    for (let i = startPage; i < endPage; i++) {
        pageIndexes.push(i);
    }
    
    return pageIndexes;
}
