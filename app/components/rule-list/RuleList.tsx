import {
  Page,
  Modal,
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
          onBulkEnable={
            handleBulkEnable
          }
          onBulkDisable={
            handleBulkDisable
          }
          onBulkDelete={
            handleBulkDelete
          }
          bulkActionLoading={
            bulkActionLoading
          }
        />
      )}

      <Modal
        open={
          Boolean(deleteRuleTarget)
        }
        onClose={() =>
          setDeleteRuleTarget(null)
        }
        title="Delete rule"
        primaryAction={{
          content: "Delete",
          destructive: true,
          loading: deleteLoading,
          onAction:
            confirmDelete,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled:
              deleteLoading,
            onAction: () =>
              setDeleteRuleTarget(null),
          },
        ]}
      >
        <Modal.Section>
          <p>
            Are you sure you want to
            delete "
            {deleteRuleTarget?.name}
            "?
          </p>

          <p>
            This action cannot be
            undone.
          </p>
        </Modal.Section>
      </Modal>

      <Modal
        open={bulkDeleteOpen}
        onClose={() => {
          if (bulkActionLoading) {
            return;
          }

          setBulkDeleteOpen(false);
        }}
        title="Delete selected rules"
        primaryAction={{
          content: "Delete",
          destructive: true,
          loading: bulkActionLoading,
          onAction: confirmBulkDelete,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: bulkActionLoading,
            onAction: () =>
              setBulkDeleteOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <p>
            Are you sure you want to
            delete{" "}
            <strong>
              {selectedRules.length}
            </strong>{" "}
            selected rules?
          </p>

          <p>
            This action cannot be
            undone.
          </p>

          {bulkDeleteError && (
            <p
              style={{
                marginTop: "12px",
              }}
            >
              <strong>
                Failed to delete rules:
              </strong>{" "}
              {bulkDeleteError}
            </p>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}