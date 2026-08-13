import {
  Badge,
} from "@shopify/polaris";

import type { Rule } from "../../types/rule";

type RuleStatusBadgeProps = {
  status: Rule["status"];
};

export default function RuleStatusBadge({
  status,
}: RuleStatusBadgeProps) {
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
}