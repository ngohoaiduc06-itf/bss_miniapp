import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { mockRules } from "../../mock/rules";
import type { Rule } from "../../types/rule";

interface RulesState {
  items: Rule[];
}

const initialState: RulesState = {
  items: mockRules,
};

const rulesSlice = createSlice({
  name: "rules",

  initialState,

  reducers: {
    createRule: (
      state,
      action: PayloadAction<
        Omit<Rule, "id" | "createdAt" | "updatedAt">
      >,
    ) => {
      const now = new Date()
        .toISOString()
        .split("T")[0];

      const maxPriority = state.items.reduce(
        (max, rule) =>
          Math.max(max, rule.priority ?? 0),
        0,
      );

      const newRule: Rule = {
        ...action.payload,

        id: crypto.randomUUID(),

        priority: maxPriority + 1,

        createdAt: now,

        updatedAt: now,
      };

      state.items.push(newRule);
    },

    updateRule: (
      state,
      action: PayloadAction<Rule>,
    ) => {
      const index = state.items.findIndex(
        (rule) =>
          rule.id === action.payload.id,
      );

      if (index === -1) {
        return;
      }

      state.items[index] = {
        ...action.payload,

        updatedAt: new Date()
          .toISOString()
          .split("T")[0],
      };
    },

    deleteRule: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.items = state.items.filter(
        (rule) =>
          rule.id !== action.payload,
      );
    },

    duplicateRule: (
      state,
      action: PayloadAction<string>,
    ) => {
      const sourceRule = state.items.find(
        (rule) =>
          rule.id === action.payload,
      );

      if (!sourceRule) {
        return;
      }

      const now = new Date()
        .toISOString()
        .split("T")[0];

      const maxPriority = state.items.reduce(
        (max, rule) =>
          Math.max(max, rule.priority ?? 0),
        0,
      );

      const duplicatedRule: Rule = {
        ...sourceRule,

        id: crypto.randomUUID(),

        name: `${sourceRule.name} Copy`,

        priority: maxPriority + 1,

        createdAt: now,

        updatedAt: now,
      };

      state.items.push(
        duplicatedRule,
      );
    },
  },
});

export const {
  createRule,
  updateRule,
  deleteRule,
  duplicateRule,
} = rulesSlice.actions;

export default rulesSlice.reducer;