import {
  ActionList,
  Box,
  Button,
  InlineStack,
  Popover,
  Text,
  TextField,
} from "@shopify/polaris";

import {
  SearchIcon,
  SortAscendingIcon,
} from "@shopify/polaris-icons";

import type {
  SortDirection,
  SortField,
} from "./utils/ruleList.utils";

type RuleListToolbarProps = {
  displayedCount: number;
  totalCount: number;

  searchOpen: boolean;
  searchValue: string;

  sortPopoverActive: boolean;
  sortField: SortField;
  sortDirection: SortDirection;

  onToggleSearch: () => void;

  onSearchChange: (
    value: string,
  ) => void;

  onClearSearch: () => void;

  onSortPopoverToggle: () => void;

  onSortPopoverClose: () => void;

  onSort: (
    field: SortField,
    direction: SortDirection,
  ) => void;
};

export default function RuleListToolbar({
  displayedCount,
  totalCount,
  searchOpen,
  searchValue,
  sortPopoverActive,
  sortField,
  sortDirection,
  onToggleSearch,
  onSearchChange,
  onClearSearch,
  onSortPopoverToggle,
  onSortPopoverClose,
  onSort,
}: RuleListToolbarProps) {
  return (
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
            {displayedCount}
          </strong>{" "}
          of{" "}
          <strong>
            {totalCount}
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
                  onSearchChange
                }
                placeholder="Search rules"
                autoComplete="off"
                autoFocus
                clearButton
                onClearButtonClick={
                  onClearSearch
                }
              />
            </Box>
          )}

          <Button
            icon={SearchIcon}
            variant={
              searchOpen
                ? "secondary"
                : "tertiary"
            }
            accessibilityLabel="Search rules"
            onClick={
              onToggleSearch
            }
          />

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
                onClick={
                  onSortPopoverToggle
                }
              />
            }
            onClose={
              onSortPopoverClose
            }
          >
            <ActionList
              sections={[
                {
                  title: "Sort by",
                  items: [
                    {
                      content: "Name",
                      onAction: () =>
                        onSort(
                          "name",
                          sortDirection,
                        ),
                    },
                    {
                      content:
                        "Priority",
                      onAction: () =>
                        onSort(
                          "priority",
                          sortDirection,
                        ),
                    },
                    {
                      content:
                        "Created date",
                      onAction: () =>
                        onSort(
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
                        onSort(
                          sortField,
                          "asc",
                        ),
                    },
                    {
                      content: "Z-A",
                      onAction: () =>
                        onSort(
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
  );
}