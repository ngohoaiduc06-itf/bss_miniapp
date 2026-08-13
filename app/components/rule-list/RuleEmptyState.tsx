import {
  Box,
  EmptyState,
} from "@shopify/polaris";

type RuleEmptyStateProps = {
  hasSearch: boolean;
  onClearSearch: () => void;
  onAddRule: () => void;
};

export default function RuleEmptyState({
  hasSearch,
  onClearSearch,
  onAddRule,
}: RuleEmptyStateProps) {
  return (
    <Box padding="800">
      <EmptyState
        heading="No rules found"
        image="https://cdn.shopify.com/static/shopify-favicon.png"
        action={{
          content: hasSearch
            ? "Clear search"
            : "Add rule",

          onAction: hasSearch
            ? onClearSearch
            : onAddRule,
        }}
      >
        <p>
          {hasSearch
            ? "Try searching for another rule name."
            : "Create your first custom pricing rule."}
        </p>
      </EmptyState>
    </Box>
  );
}