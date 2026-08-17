import {
  Page,
} from "@shopify/polaris";

import {
  useNavigate,
} from "react-router";

import {
  useAppSelector,
} from "../../store/hooks";

import RuleListToolbar from "./RuleListToolbar";
import RuleTable from "./RuleTable";
import RuleEmptyState from "./RuleEmptyState";

import {
  useRuleList,
} from "./hooks/useRuleList";

export default function RuleList() {
  const navigate =
    useNavigate();

  const rules =
    useAppSelector(
      (state) =>
        state.rules.items,
    );

  const shopData =
    useAppSelector(
      (state) =>
        state.shopData,
    );

  const {
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
  } = useRuleList({
    shopId: shopData.id,
    rules,
  });

  const handleAddRule = () => {
    navigate(
      "/app/rules/new",
    );
  };

  const handleEdit = (
    rule: typeof rules[number],
  ) => {
    navigate(
      `/app/rules/${rule.id}/edit`,
    );
  };

  return (
    <Page
      title="Configuration"
      backAction={{
        content: "Back",
        onAction: () =>
          navigate("/app"),
      }}
      primaryAction={{
        content: "Add rule",
        onAction:
          handleAddRule,
      }}
    >
      <RuleListToolbar
        displayedCount={
          displayedRules.length
        }
        totalCount={
          rules.length
        }
        searchOpen={
          searchOpen
        }
        searchValue={
          searchValue
        }
        sortPopoverActive={
          sortPopoverActive
        }
        sortField={sortField}
        sortDirection={
          sortDirection
        }
        onToggleSearch={
          toggleSearch
        }
        onSearchChange={
          setSearchValue
        }
        onClearSearch={() =>
          setSearchValue("")
        }
        onSortPopoverToggle={() =>
          setSortPopoverActive(
            (active) =>
              !active,
          )
        }
        onSortPopoverClose={() =>
          setSortPopoverActive(
            false,
          )
        }
        onSort={handleSort}
      />

      {displayedRules.length ===
      0 ? (
        <RuleEmptyState
          hasSearch={
            Boolean(
              searchValue.trim(),
            )
          }
          onClearSearch={() =>
            setSearchValue("")
          }
          onAddRule={
            handleAddRule
          }
        />
      ) : (
        <RuleTable
          rules={
            displayedRules
          }
          selectedRules={
            selectedRules
          }
          selectedItemsCount={
            selectedItemsCount
          }
          onSelectionChange={
            handleSelectionChange
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      )}
    </Page>
  );
}