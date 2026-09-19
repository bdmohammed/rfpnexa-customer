//@ts-nocheck
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TenderFilters from "@/components/categories/listing/TenderFilters";
import TenderSearch from "@/components/categories/listing/TenderSearch";
import TenderResults from "@/components/categories/listing/TenderResults";
import TenderPagination from "@/components/categories/listing/TenderPagination";
import { useCategories } from "@/features/categories/api/queries";
import { useTenders } from "@/features/tenders/api/queries";
import { SlidersHorizontal, X, FileText } from "lucide-react";

function TendersListContent() {
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  // States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [stateId, setStateId] = useState("");
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state if searchParam changes
  useEffect(() => {
    if (searchParams.get("search")) {
      setSearch(searchParams.get("search") || "");
    }
  }, [searchParams]);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, stateId, selectedBudgets]);

  // Categories query
  const { data: categories } = useCategories();

  // Compute budget
  let minPriceCents: number | undefined;
  let maxPriceCents: number | undefined;

  if (selectedBudgets.length > 0) {
    const budgetMap: Record<string, { min: number; max?: number }> = {
      "10k-50k": { min: 10_000_00, max: 50_000_00 },
      "50k-250k": { min: 50_000_00, max: 250_000_00 },
      "250k-1M": { min: 250_000_00, max: 1_000_000_00 },
      "1M+": { min: 1_000_000_00 },
    };

    const mins = selectedBudgets
      .map((b) => budgetMap[b]?.min)
      .filter((m) => m !== undefined) as number[];
    const maxs = selectedBudgets
      .map((b) => budgetMap[b]?.max)
      .filter((m) => m !== undefined) as number[];

    if (mins.length > 0) {
      minPriceCents = Math.min(...mins);
    }
    if (maxs.length === selectedBudgets.length) {
      maxPriceCents = Math.max(...maxs);
    }
  }

  // Tenders Query
  const {
    data: response,
    isLoading: isTendersLoading,
    error,
  } = useTenders({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    countryId: stateId || undefined,
    minPriceCents,
    maxPriceCents,
    page,
    limit: 10,
  });

  const tenders = Array.isArray(response?.data)
    ? response.data
    : Array.isArray((response?.data as any)?.tenders)
      ? (response.data as any).tenders
      : [];

  const meta = response?.meta as any;
  const totalPages =
    meta?.totalPages || (meta?.total ? Math.ceil(meta.total / 10) : 1);

  return (
    <main className="py-12 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold uppercase tracking-wider mb-3">
              <FileText className="w-4 h-4" />
              <span>Government Bids & Procurement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
              All Procurement Opportunities
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              Browse, search, and download official government contract
              specifications nationwide.
            </p>
          </div>

          {meta?.total !== undefined && (
            <div className="text-sm font-semibold text-[var(--muted)]">
              Showing{" "}
              <span className="text-[var(--foreground)] font-bold">
                {tenders.length}
              </span>{" "}
              of{" "}
              <span className="text-[var(--primary)] font-bold">
                {meta.total}
              </span>{" "}
              active tenders
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Category Select Filter */}
            {categories && categories.length > 0 && (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
                  Industry Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 text-xs sm:text-sm text-[var(--foreground)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id || cat.slug} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <TenderFilters
              stateId={stateId}
              setStateId={setStateId}
              selectedBudgets={selectedBudgets}
              setSelectedBudgets={setSelectedBudgets}
            />
          </div>

          {/* Main Results Column */}
          <div className="lg:col-span-9">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden w-full mb-4 px-4 py-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl font-semibold text-sm text-[var(--foreground)] flex items-center justify-center gap-2 hover:bg-[var(--border)] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#003EC7] dark:text-blue-400" />
              Filter Opportunities
            </button>

            <TenderSearch search={search} setSearch={setSearch} />

            <TenderResults
              tenders={tenders}
              isLoading={isTendersLoading}
              error={error}
              categorySlug=""
            />

            {totalPages > 1 && (
              <TenderPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-[var(--surface)] border-l border-[var(--border)] h-full p-6 overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categories && categories.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 text-sm text-[var(--foreground)]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id || cat.slug} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <TenderFilters
              stateId={stateId}
              setStateId={setStateId}
              selectedBudgets={selectedBudgets}
              setSelectedBudgets={setSelectedBudgets}
              className="space-y-6"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default function TendersListPage() {
  return (
    <Suspense
      fallback={
        <main className="py-20 text-center text-[var(--muted)]">
          Loading tenders...
        </main>
      }
    >
      <TendersListContent />
    </Suspense>
  );
}
