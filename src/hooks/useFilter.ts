"use client";
import { useState, useMemo, useCallback } from "react";

interface UseFilterOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  defaultPerPage?: number;
}

export function useFilter<T extends Record<string, unknown>>({
  data,
  searchKeys,
  defaultPerPage = 20,
}: UseFilterOptions<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});

  const filtered = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key] ?? "").toLowerCase().includes(q)
        )
      );
    }

    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== "all") {
        result = result.filter((item) => String(item[key as keyof T]) === val);
      }
    });

    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return result;
  }, [data, search, searchKeys, filters, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const handleSort = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleFilter = useCallback((key: keyof T, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  }, []);

  return {
    search,
    setSearch: handleSearch,
    page,
    setPage,
    perPage,
    setPerPage,
    sortKey,
    sortDir,
    handleSort,
    filters,
    handleFilter,
    filtered,
    paginated,
    total: filtered.length,
    totalPages,
  };
}
