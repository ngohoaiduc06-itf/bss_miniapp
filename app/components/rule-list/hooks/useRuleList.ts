import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAppDispatch } from "../../../store/hooks";

import {
  deleteRule,
  fetchRules,
} from "../../../store/slices/rulesSlice";

import type { Rule } from "../../../types/rule";

import {
  filterAndSortRules,
  type SortDirection,
  type SortField,
} from "../utils/ruleList.utils";

type UseRuleListParams = {
  shopId?: number | null;
  rules: Rule[];
};

export function useRuleList({
  shopId,
  rules,
}: UseRuleListParams) {
  const dispatch =
    useAppDispatch();

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  const [
    sortPopoverActive,
    setSortPopoverActive,
  ] = useState(false);

  const [
    sortField,
    setSortField,
  ] =
    useState<SortField>(
      "priority",
    );

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>(
      "asc",
    );

  const [
    selectedRules,
    setSelectedRules,
  ] = useState<string[]>([]);

  useEffect(() => {
    if (!shopId) {
      return;
    }

    dispatch(
      fetchRules(shopId),
    );
  }, [
    dispatch,
    shopId,
  ]);

  const displayedRules =
    useMemo(
      () =>
        filterAndSortRules(
          rules,
          searchValue,
          sortField,
          sortDirection,
        ),
      [
        rules,
        searchValue,
        sortField,
        sortDirection,
      ],
    );

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchValue("");
      setSearchOpen(false);
      return;
    }

    setSearchOpen(true);
  };

  const handleSort = (
    field: SortField,
    direction: SortDirection,
  ) => {
    setSortField(field);
    setSortDirection(
      direction,
    );
    setSortPopoverActive(
      false,
    );
  };

  const handleSelectionChange = (
    selectionType: string,
    isSelecting: boolean,
    selection?: string,
  ) => {
    if (
      selectionType === "all" ||
      selectionType === "page"
    ) {
      if (isSelecting) {
        setSelectedRules(
          displayedRules.map(
            (rule) =>
              rule.id,
          ),
        );
      } else {
        setSelectedRules(
          [],
        );
      }

      return;
    }

    if (!selection) {
      return;
    }

    if (isSelecting) {
      setSelectedRules(
        (currentSelected) => {
          if (
            currentSelected.includes(
              selection,
            )
          ) {
            return currentSelected;
          }

          return [
            ...currentSelected,
            selection,
          ];
        },
      );

      return;
    }

    setSelectedRules(
      (currentSelected) =>
        currentSelected.filter(
          (id) =>
            id !== selection,
        ),
    );
  };

  const handleDelete = async (
    rule: Rule,
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${rule.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteRule(rule.id),
      ).unwrap();

      if (shopId) {
        dispatch(
          fetchRules(shopId),
        );
      }

      setSelectedRules(
        (currentSelected) =>
          currentSelected.filter(
            (id) =>
              id !== rule.id,
          ),
      );
    } catch (error) {
      console.error(
        "Failed to delete rule:",
        error,
      );
    }
  };

  const allDisplayedSelected =
    displayedRules.length > 0 &&
    displayedRules.every(
      (rule) =>
        selectedRules.includes(
          rule.id,
        ),
    );

  const selectedItemsCount: number | "All" =
    allDisplayedSelected
      ? "All"
      : selectedRules.length;

  return {
    searchOpen,
    searchValue,

    sortPopoverActive,
    sortField,
    sortDirection,

    selectedRules,

    displayedRules,

    selectedItemsCount,

    toggleSearch,

    setSearchValue,

    setSortPopoverActive,

    handleSort,

    handleSelectionChange,

    handleDelete,

    setSelectedRules,
  };
}