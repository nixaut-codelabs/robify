'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';

/**
 * Modern Pagination Component
 * Responsive, accessible, and optimized pagination with proper UX patterns
 */
export default function Pagination({ totalPages, className = '' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Memoize URL creation for performance
  const createPageURL = useMemo(() => (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  // Generate pagination logic with improved algorithm
  const paginationData = useMemo(() => {
    if (totalPages <= 1) return null;

    const delta = 2; // Number of pages to show around current page
    const pages = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Always include first page
    pages.push(1);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis-start');
    }

    // Add middle pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Always include last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return {
      pages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages
    };
  }, [currentPage, totalPages]);

  if (!paginationData) return null;

  const { pages, hasNext, hasPrev, isFirstPage, isLastPage } = paginationData;

  return (
    <nav
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 ${className}`}
      aria-label="Sayfa navigasyonu"
      role="navigation"
    >
      {/* Page Info - Mobile */}
      <div className="sm:hidden text-sm text-text-muted">
        Sayfa {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <PaginationButton
          href={hasPrev ? createPageURL(currentPage - 1) : null}
          disabled={isFirstPage}
          className="px-3 py-2 sm:px-4"
          aria-label="Önceki sayfa"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Önceki</span>
        </PaginationButton>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (typeof page === 'string' && page.startsWith('ellipsis')) {
              return (
                <span
                  key={page}
                  className="px-2 py-2 text-text-muted select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <PaginationButton
                key={page}
                href={createPageURL(page)}
                active={isActive}
                className="min-w-[40px] h-10 text-sm font-medium"
                aria-label={`${isActive ? 'Mevcut sayfa, ' : ''}Sayfa ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </PaginationButton>
            );
          })}
        </div>

        {/* Next Button */}
        <PaginationButton
          href={hasNext ? createPageURL(currentPage + 1) : null}
          disabled={isLastPage}
          className="px-3 py-2 sm:px-4"
          aria-label="Sonraki sayfa"
        >
          <span className="hidden sm:inline">Sonraki</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PaginationButton>
      </div>

      {/* Page Info - Desktop */}
      <div className="hidden sm:block text-sm text-text-muted">
        Sayfa {currentPage} / {totalPages}
      </div>
    </nav>
  );
}

/**
 * Reusable Pagination Button Component
 */
function PaginationButton({
  href,
  children,
  active = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center
    px-3 py-2 text-sm font-medium
    rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
    select-none
  `;

  const variantClasses = active
    ? `
      bg-accent text-white border-accent
      shadow-lg shadow-accent/25
      hover:bg-accent-light hover:shadow-accent/30
    `
    : disabled
    ? `
      bg-card border-border text-text-muted
      cursor-not-allowed opacity-50
    `
    : `
      bg-card border-border text-text-secondary
      hover:bg-card-hover hover:border-border-light hover:text-accent
      hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0
    `;

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (disabled || !href) {
    return (
      <span className={combinedClasses} {...props}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={combinedClasses} {...props}>
      {children}
    </Link>
  );
}