'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LinkList from './LinkList';
import { createBrowserClient } from '../lib/supabase/client';
import { LinkWithContent } from '../../types/link';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from './ui/toggle-group';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"
import { groupLinksByDate, GroupedLinks } from '../../utils/groupLinksByDate';

type DashboardClientProps = {
  initialLinks: LinkWithContent[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
};

type SortValue = 'date-newest' | 'date-oldest' | 'title-asc';
const PAGE_SIZE = 24;

export default function DashboardClient({ initialLinks, totalPages, currentPage, totalCount }: DashboardClientProps) {
  const [links, setLinks] = React.useState(initialLinks);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [density, setDensity] = React.useState<'comfortable' | 'compact'>('comfortable');
  const [sort, setSort] = React.useState<SortValue>('date-newest');
  const router = useRouter();
  const supabase = createBrowserClient();
  const [groupedLinks, setGroupedLinks] = React.useState<GroupedLinks>({});

  React.useEffect(() => {
    setLinks(initialLinks);
    setGroupedLinks(groupLinksByDate(initialLinks));
  }, [initialLinks]);

  const handleSortChange = (newSort: SortValue) => {
    setSort(newSort);
    router.push(`/dashboard?page=${currentPage}&sort=${newSort}`);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      router.push(`/dashboard?page=${page}&sort=${sort}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = 5; // Total number of visible page links
    
    // Always show first page
    pageNumbers.push(
      <PaginationItem key={1}>
        <PaginationLink href={`/dashboard?page=1&sort=${sort}`} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= visiblePages) {
      for (let i = 2; i < totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={`/dashboard?page=${i}&sort=${sort}`} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage < 4) {
        startPage = 2;
        endPage = 4;
      }
      
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      if (currentPage > 3) {
        pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={`/dashboard?page=${i}&sort=${sort}`} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={`/dashboard?page=${totalPages}&sort=${sort}`} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">All Links</h1>
        <div className="flex items-center gap-4">
          {viewMode === 'grid' && (
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={density}
              onValueChange={(value) => {
                if (value) setDensity(value as 'comfortable' | 'compact');
              }}
              className="hidden md:flex"
            >
              <ToggleGroupItem value="comfortable" aria-label="Comfortable view">
                Comfortable
              </ToggleGroupItem>
              <ToggleGroupItem value="compact" aria-label="Compact view">
                Compact
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <ToggleGroup 
            type="single" 
            defaultValue="grid" 
            variant="outline" 
            size="sm"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as 'grid' | 'list');
            }}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span>Sort by...</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleSortChange('date-newest')}>
                Date Added: Newest
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSortChange('date-oldest')}>
                Date Added: Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSortChange('title-asc')}>
                Title: A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-grow min-w-0 flex">
        <LinkList links={groupedLinks} viewMode={viewMode} density={density} />
      </div>
       {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {initialLinks.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
              {(currentPage - 1) * PAGE_SIZE + initialLinks.length}
            </strong>{' '}
            of <strong>{totalCount}</strong> links
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/dashboard?page=${currentPage - 1}&sort=${sort}`}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext
                  href={`/dashboard?page=${currentPage + 1}&sort=${sort}`}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 