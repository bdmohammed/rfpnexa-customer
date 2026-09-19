"use client";

import { useCountries, useStates } from "@/features/country/api/queries";
import React from "react";
import type { State } from "@/types";

interface TenderFiltersProps {
  stateId: string;
  setStateId: (id: string) => void;
  selectedBudgets: string[];
  setSelectedBudgets: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export default function TenderFilters({
  stateId,
  setStateId,
  selectedBudgets,
  setSelectedBudgets,
  className = "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sticky top-28",
}: TenderFiltersProps) {
  const { data: states, isLoading } = useCountries();

  const handleBudgetChange = (budgetKey: string) => {
    setSelectedBudgets((prev) =>
      prev.includes(budgetKey)
        ? prev.filter((b) => b !== budgetKey)
        : [...prev, budgetKey],
    );
  };

  const handleReset = () => {
    setStateId("");
    setSelectedBudgets([]);
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-2xl text-[var(--foreground)]">Filters</h3>
        <button
          onClick={handleReset}
          className="text-[#003EC7] hover:underline text-sm font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Location
        </label>
        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          disabled={isLoading}
          className="
          w-full
          mt-2
          border
          border-[var(--border)]
          rounded-xl
          p-3
          bg-[var(--surface)]
          text-[var(--foreground)]
          focus:outline-hidden focus:ring-1 focus:ring-[#003EC7]
        "
        >
          <option value="">All States / Locations</option>
          {states?.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name} ({st.code})
            </option>
          ))}
        </select>
      </div>

      {/* <div className="mt-8">
        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Budget Range
        </label>

        <div className="space-y-3 mt-3 text-sm text-[var(--foreground)]">
          <label className="flex gap-3 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBudgets.includes("10k-50k")}
              onChange={() => handleBudgetChange("10k-50k")}
              className="h-4 w-4 rounded-sm border-[var(--border)] text-[#003EC7]"
            />
            $10k - $50k
          </label>

          <label className="flex gap-3 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBudgets.includes("50k-250k")}
              onChange={() => handleBudgetChange("50k-250k")}
              className="h-4 w-4 rounded-sm border-[var(--border)] text-[#003EC7]"
            />
            $50k - $250k
          </label>

          <label className="flex gap-3 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBudgets.includes("250k-1M")}
              onChange={() => handleBudgetChange("250k-1M")}
              className="h-4 w-4 rounded-sm border-[var(--border)] text-[#003EC7]"
            />
            $250k - $1M
          </label>

          <label className="flex gap-3 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBudgets.includes("1M+")}
              onChange={() => handleBudgetChange("1M+")}
              className="h-4 w-4 rounded-sm border-[var(--border)] text-[#003EC7]"
            />
            $1M+
          </label>
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Tender Type
        </label>

        <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold text-[var(--muted)]">
          <span className="px-3 py-1 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)]">
            Open RFP
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)]">
            Govt
          </span>
        </div>
      </div> */}
    </div>
  );
}
