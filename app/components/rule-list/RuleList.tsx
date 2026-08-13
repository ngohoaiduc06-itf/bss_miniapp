import {
  ActionList,
  Badge,
  Box,
  Button,
  EmptyState,
  IndexTable,
  InlineStack,
  Link,
  Page,
  Popover,
  Text,
  TextField,
} from "@shopify/polaris";

import {
  DeleteIcon,
  EditIcon,
  DuplicateIcon,
  SearchIcon,
  SortAscendingIcon,
} from "@shopify/polaris-icons";

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteRule,
  // duplicateRule,
  fetchRules,
} from "../../store/slices/rulesSlice";

import type { Rule } from "../../types/rule";

type SortField =
  | "name"
  | "priority"
  | "createdAt";

type SortDirection =
  | "asc"
  | "desc";

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toDateString();
};

export default function RuleList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const rules = useAppSelector(
    (state) => state.rules.items,
  );

  const shopData = useAppSelector(
    (state) => state.shopData,
  );

  const loading = useAppSelector(
    (state) => state.rules.loading,
  );

  const error = useAppSelector(
    (state) => state.rules.error,
  );

  useEffect(() => {
    if (!shopData.id) {
      return;
    }

    dispatch(fetchRules(shopData.id));
  }, [dispatch, shopData.id]);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [
    sortPopoverActive,
    setSortPopoverActive,
  ] = useState(false);

  const [sortField, setSortField] =
    useState<SortField>("priority");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [selectedRules, setSelectedRules] =
    useState<string[]>([]);

  const displayedRules = useMemo(() => {
    let result = [...rules];

    const keyword = searchValue
      .trim()
      .toLowerCase();

    if (keyword) {
      result = result.filter((rule) =>
        rule.name
          .toLowerCase()
          .includes(keyword),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison =
            a.name.localeCompare(b.name);
          break;

        case "priority":
          comparison =
            a.priority - b.priority;
          break;

        case "createdAt": {
          const dateA = a.createdAt
            ? new Date(
              a.createdAt,
            ).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(
              b.createdAt,
            ).getTime()
            : 0;

          comparison = dateA - dateB;
          break;
        }
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    rules,
    searchValue,
    sortField,
    sortDirection,
  ]);

  const renderStatus = (
    status: Rule["status"],
  ) => {
    if (status === "enable") {
      return (
        <Badge tone="success">
          Enable
        </Badge>
      );
    }

    return (
      <Badge tone="new">
        Disable
      </Badge>
    );
  };

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

  const handleEdit = (rule: Rule) => {
    navigate(
      `/app/rules/${rule.id}/edit`,
    );
  };
  const handleDelete = async (rule: Rule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${rule.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteRule(rule.id)).unwrap();
      if (shopData.id) {
        dispatch(fetchRules(shopData.id));
      }
      setSelectedRules((currentSelected) =>
        currentSelected.filter((id) => id !== rule.id),
      );
    } catch (error) {
      console.error("Xóa rule thất bại:", error);
    }
  };
  const handleAddRule = () => {
    console.log("Hello Word")
    navigate("/app/rules/new");
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
    } else {
      setSelectedRules(
        (currentSelected) =>
          currentSelected.filter(
            (id) =>
              id !== selection,
          ),
      );
    }
  };

  const allDisplayedSelected =
    displayedRules.length > 0 &&
    displayedRules.every((rule) =>
      selectedRules.includes(rule.id),
    );

  const selectedItemsCount =
    allDisplayedSelected
      ? "All"
      : selectedRules.length;

  return (
    <Page
      title="Configuration"
      backAction={{
        content: "Back",
        onAction: () =>
          navigate("/app"),
      }}
      secondaryActions={[
        {
          content: "Export",
          onAction: () => {
            console.log(
              "Export rules",
            );
          },
        },
        {
          content: "Import",
          onAction: () => {
            console.log(
              "Import rules",
            );
          },
        },
      ]}
      primaryAction={{
        content: "Add rule",
        onAction: handleAddRule,
      }}
    >
      <Box padding="300">
        <InlineStack
          align="space-between"
          blockAlign="center"
        >
          <Text
            as="span"
            variant="bodySm"
          >
            Showing{" "}
            <strong>
              {displayedRules.length}
            </strong>{" "}
            of{" "}
            <strong>
              {rules.length}
            </strong>{" "}
            rules
          </Text>

          <InlineStack
            gap="100"
            blockAlign="center"
          >
            {searchOpen && (
              <Box minWidth="240px">
                <TextField
                  label="Search rules"
                  labelHidden
                  value={searchValue}
                  onChange={
                    setSearchValue
                  }
                  placeholder="Search rules"
                  autoComplete="off"
                  autoFocus
                  clearButton
                  onClearButtonClick={() =>
                    setSearchValue("")
                  }
                />
              </Box>
            )}

            {/* SEARCH */}

            <Button
              icon={SearchIcon}
              variant={
                searchOpen
                  ? "secondary"
                  : "tertiary"
              }
              accessibilityLabel="Search rules"
              onClick={toggleSearch}
            />

            {/* SORT */}

            <Popover
              active={
                sortPopoverActive
              }
              activator={
                <Button
                  icon={
                    SortAscendingIcon
                  }
                  variant="tertiary"
                  accessibilityLabel="Sort rules"
                  onClick={() =>
                    setSortPopoverActive(
                      (active) =>
                        !active,
                    )
                  }
                />
              }
              onClose={() =>
                setSortPopoverActive(
                  false,
                )
              }
            >
              <ActionList
                sections={[
                  {
                    title: "Sort by",
                    items: [
                      {
                        content:
                          "Name",
                        onAction: () =>
                          handleSort(
                            "name",
                            sortDirection,
                          ),
                      },
                      {
                        content:
                          "Priority",
                        onAction: () =>
                          handleSort(
                            "priority",
                            sortDirection,
                          ),
                      },
                      {
                        content:
                          "Created date",
                        onAction: () =>
                          handleSort(
                            "createdAt",
                            sortDirection,
                          ),
                      },
                    ],
                  },
                  {
                    title: "Order",
                    items: [
                      {
                        content: "A-Z",
                        onAction: () =>
                          handleSort(
                            sortField,
                            "asc",
                          ),
                      },
                      {
                        content: "Z-A",
                        onAction: () =>
                          handleSort(
                            sortField,
                            "desc",
                          ),
                      },
                    ],
                  },
                ]}
              />
            </Popover>
          </InlineStack>
        </InlineStack>
      </Box>

      {displayedRules.length ===
        0 ? (
        <Box padding="800">
          <EmptyState
            heading="No rules found"
            image="https://cdn.shopify.com/static/shopify-favicon.png"
            action={{
              content:
                searchValue
                  ? "Clear search"
                  : "Add rule",
              onAction: () => {
                if (searchValue) {
                  setSearchValue("");
                } else {
                  handleAddRule();
                }
              },
            }}
          >
            <p>
              {searchValue
                ? "Try searching for another rule name."
                : "Create your first custom pricing rule."}
            </p>
          </EmptyState>
        </Box>
      ) : (

        <IndexTable
          resourceName={{
            singular: "rule",
            plural: "rules",
          }}
          itemCount={
            displayedRules.length
          }
          selectedItemsCount={
            selectedItemsCount
          }
          onSelectionChange={
            handleSelectionChange
          }
          selectable
          headings={[
            {
              title: "Name",
            },
            {
              title: "Status",
            },
            {
              title: "Priority",
            },
            {
              title: "Created Date",
            },
            {
              title: "Updated Date",
            },
            {
              title: "Action",
            },
          ]}
        >
          {displayedRules.map(
            (rule, index) => (
              <IndexTable.Row
                id={rule.id}
                key={rule.id}
                position={index}
                onClick={() => handleEdit(rule)}
                selected={selectedRules.includes(
                  rule.id,
                )}
              >
                {/* NAME */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    variant="bodyMd"
                    fontWeight="semibold"
                  >
                    {rule.name}
                  </Text>
                </IndexTable.Cell>

                {/* STATUS */}

                <IndexTable.Cell>
                  {renderStatus(
                    rule.status,
                  )}
                </IndexTable.Cell>

                {/* PRIORITY */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    variant="bodyMd"
                  >
                    {rule.priority}
                  </Text>
                </IndexTable.Cell>

                {/* CREATED DATE */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    variant="bodyMd"
                  >
                    {formatDate(rule.createdAt) ?? "-"}
                  </Text>
                </IndexTable.Cell>

                {/* UPDATED DATE */}

                <IndexTable.Cell>
                  <Text
                    as="span"
                    variant="bodyMd"
                  >
                    {formatDate(rule.updatedAt) ?? "--"}
                  </Text>
                </IndexTable.Cell>

                {/* ACTION */}
                <IndexTable.Cell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <InlineStack gap="200" wrap={false}>
                      {/* EDIT */}
                      <Button
                        icon={EditIcon}
                        variant="secondary"
                        size="slim"
                        accessibilityLabel={`Edit ${rule.name}`}
                        onClick={() => handleEdit(rule)}
                      />

                      {/* DUPLICATE */}
                      <Button
                        icon={DuplicateIcon}
                        variant="secondary"
                        size="slim"
                        accessibilityLabel={`Duplicate ${rule.name}`}
                      />

                      {/* DELETE */}
                      <Button
                        icon={DeleteIcon}
                        variant="secondary"
                        size="slim"
                        tone="critical"
                        accessibilityLabel={`Delete ${rule.name}`}
                        onClick={() => handleDelete(rule)}
                      />
                    </InlineStack>
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            ),
          )}
        </IndexTable>
      )}
    </Page>
  );
}