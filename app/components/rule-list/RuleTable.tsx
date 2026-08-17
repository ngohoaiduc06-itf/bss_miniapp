import {
  Button,
  IndexTable,
  InlineStack,
  Text,
} from "@shopify/polaris";

import {
  DeleteIcon,
  EditIcon,
} from "@shopify/polaris-icons";

import type { Rule } from "../../types/rule";

import RuleStatusBadge from "./RuleStatusBadge";

import {
  formatDate,
} from "./utils/ruleList.utils";

type RuleTableProps = {
  rules: Rule[];
  selectedRules: string[];
  selectedItemsCount:
  | number
  | "All";

  onSelectionChange: (
    selectionType: string,
    isSelecting: boolean,
    selection?: string,
  ) => void;

  onEdit: (
    rule: Rule,
  ) => void;

  onDelete: (
    rule: Rule,
  ) => void;

  onBulkEnable: () => void;

  onBulkDisable: () => void;

  onBulkDelete: () => void;

  bulkActionLoading?: boolean;
};

export default function RuleTable({
  rules,
  selectedRules,
  selectedItemsCount,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkEnable,
  onBulkDisable,
  onBulkDelete,
  bulkActionLoading = false,
}: RuleTableProps) {
  const promotedBulkActions = [
    {
      content: "Enable",
      onAction: onBulkEnable,
      disabled: bulkActionLoading,
    },
    {
      content: "Disable",
      onAction: onBulkDisable,
      disabled: bulkActionLoading,
    },
    {
      content: "Delete",
      destructive: true,
      onAction: onBulkDelete,
      disabled: bulkActionLoading,
    },
  ];

  return (
    <IndexTable
      resourceName={{
        singular: "rule",
        plural: "rules",
      }}
      itemCount={
        rules.length
      }
      selectedItemsCount={
        selectedItemsCount
      }
      onSelectionChange={
        onSelectionChange
      }
      promotedBulkActions={
        promotedBulkActions
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
      {rules.map(
        (rule, index) => (
          <IndexTable.Row
            id={rule.id}
            key={rule.id}
            position={index}
            onClick={() =>
              onEdit(rule)
            }
            selected={selectedRules.includes(
              rule.id,
            )}
          >
            <IndexTable.Cell>
              <Text
                as="span"
                variant="bodyMd"
                fontWeight="semibold"
              >
                {rule.name}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <RuleStatusBadge
                status={
                  rule.status
                }
              />
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text
                as="span"
                variant="bodyMd"
              >
                {rule.priority}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text
                as="span"
                variant="bodyMd"
              >
                {formatDate(
                  rule.createdAt,
                ) ?? "-"}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text
                as="span"
                variant="bodyMd"
              >
                {formatDate(
                  rule.updatedAt,
                ) ?? "--"}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <div
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <InlineStack
                  gap="200"
                  wrap={false}
                >
                  <Button
                    icon={EditIcon}
                    variant="secondary"
                    size="slim"
                    accessibilityLabel={`Edit ${rule.name}`}
                    onClick={() =>
                      onEdit(rule)
                    }
                  />

                  <Button
                    icon={DeleteIcon}
                    variant="secondary"
                    size="slim"
                    tone="critical"
                    accessibilityLabel={`Delete ${rule.name}`}
                    onClick={() =>
                      onDelete(rule)
                    }
                  />
                </InlineStack>
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        ),
      )}
    </IndexTable>
  );
}