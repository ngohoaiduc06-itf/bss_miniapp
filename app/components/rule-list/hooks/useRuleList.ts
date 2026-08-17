import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAppDispatch } from "../../../store/hooks";

import {
  deleteRule,
  updateRule,
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
  const dispatch = useAppDispatch();

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [sortPopoverActive, setSortPopoverActive] =
    useState(false);

  const [sortField, setSortField] =
    useState<SortField>("priority");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [selectedRules, setSelectedRules] =
    useState<string[]>([]);

  const [deleteRuleTarget, setDeleteRuleTarget] =
    useState<Rule | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [bulkActionLoading, setBulkActionLoading] =
    useState(false);

  const [bulkDeleteOpen, setBulkDeleteOpen] =
    useState(false);

  const [bulkDeleteError, setBulkDeleteError] =
    useState<string | null>(null);

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
    setSortDirection(direction);
    setSortPopoverActive(false);
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
            (rule) => rule.id,
          ),
        );
      } else {
        setSelectedRules([]);
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

  const handleDelete = (
    rule: Rule,
  ) => {
    setDeleteRuleTarget(rule);
  };

  const confirmDelete = async () => {
    if (!deleteRuleTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      await dispatch(
        deleteRule(
          deleteRuleTarget.id,
        ),
      ).unwrap();

      if (shopId) {
        await dispatch(
          fetchRules(shopId),
        ).unwrap();
      }

      setSelectedRules(
        (currentSelected) =>
          currentSelected.filter(
            (id) =>
              id !==
              deleteRuleTarget.id,
          ),
      );

      setDeleteRuleTarget(null);
    } catch (error) {
      console.error(
        "Failed to delete rule:",
        error,
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkStatusChange = async (
    status: "enable" | "disable",
  ) => {
    if (
      selectedRules.length === 0
    ) {
      return;
    }

    try {
      setBulkActionLoading(true);

      const selectedRuleObjects =
        rules.filter((rule) =>
          selectedRules.includes(
            rule.id,
          ),
        );

      for (const rule of selectedRuleObjects) {
        await dispatch(
          updateRule({
            ...rule,
            status,
            updatedAt:
              new Date()
                .toISOString()
                .split("T")[0],
          }),
        ).unwrap();
      }

      if (shopId) {
        await dispatch(
          fetchRules(shopId),
        ).unwrap();
      }

      setSelectedRules([]);
    } catch (error) {
      console.error(
        `Failed to ${status} selected rules:`,
        error,
      );
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkEnable = () => {
    handleBulkStatusChange("enable");
  };

  const handleBulkDisable = () => {
    handleBulkStatusChange("disable");
  };

  const handleBulkDelete = () => {
    if (
      selectedRules.length === 0
    ) {
      return;
    }

    setBulkDeleteError(null);
    setBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (
      selectedRules.length === 0
    ) {
      return;
    }

    try {
      setBulkActionLoading(true);
      setBulkDeleteError(null);

      const idsToDelete = [
        ...selectedRules,
      ];

      for (const ruleId of idsToDelete) {
        await dispatch(
          deleteRule(ruleId),
        ).unwrap();
      }

      if (shopId) {
        await dispatch(
          fetchRules(shopId),
        ).unwrap();
      }

      setSelectedRules([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error(
        "Failed to delete selected rules:",
        error,
      );

      setBulkDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete selected rules",
      );
    } finally {
      setBulkActionLoading(false);
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

  const selectedItemsCount:
    | number
    | "All" =
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
    deleteRuleTarget,
    deleteLoading,
    bulkActionLoading,
    bulkDeleteOpen,
    bulkDeleteError,
    toggleSearch,
    setSearchValue,
    setSortPopoverActive,
    handleSort,
    handleSelectionChange,
    handleDelete,
    confirmDelete,
    handleBulkEnable,
    handleBulkDisable,
    handleBulkDelete,
    confirmBulkDelete,
    setDeleteRuleTarget,
    setBulkDeleteOpen,
    setSelectedRules,
  };
}