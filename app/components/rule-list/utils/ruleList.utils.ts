import type { Rule } from "../../../types/rule";

export type SortField =
  | "name"
  | "priority"
  | "createdAt";

export type SortDirection =
  | "asc"
  | "desc";

export const formatDate = (
  dateString?: string,
) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toDateString();
};

export const filterAndSortRules = (
  rules: Rule[],
  searchValue: string,
  sortField: SortField,
  sortDirection: SortDirection,
) => {
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

        comparison =
          dateA - dateB;

        break;
      }
    }

    return sortDirection === "asc"
      ? comparison
      : -comparison;
  });

  return result;
};