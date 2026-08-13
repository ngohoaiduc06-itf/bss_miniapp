import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createRule as createRuleApi,
  deleteRule as deleteRuleApi,
  getRule as getRuleApi,
  getRules,
  updateRule as updateRuleApi,
} from "../../api/ruleApi";

import type { Rule } from "../../types/rule";

interface RulesState {
  items: Rule[];
  loading: boolean;
  error: string | null;
}

const initialState: RulesState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * GET rules
 */
export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async (shopId: number) => {
    return await getRules(shopId);
  },
);

export const fetchRuleById = createAsyncThunk(
  "rules/fetchRuleById",
  async (id: string) => {
    return await getRuleApi(id);
  },
);

/**
 * CREATE rule
 */
export const createRule = createAsyncThunk(
  "rules/createRule",
  async ({
    shopId,
    data,
  }: {
    shopId: number;
    data: Omit<
      Rule,
      "id" | "createdAt" | "updatedAt"
    >;
  }) => {
    return await createRuleApi({
      ...data,
      shopId,
    });
  },
);

/**
 * UPDATE rule
 */
export const updateRule = createAsyncThunk(
  "rules/updateRule",
  async (rule: Rule) => {
    return await updateRuleApi(
      rule.id,
      rule,
    );
  },
);

/**
 * DELETE rule
 */
export const deleteRule = createAsyncThunk(
  "rules/deleteRule",
  async (id: string) => {
    await deleteRuleApi(id);

    return id;
  },
);

const rulesSlice = createSlice({
  name: "rules",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // =========================
      // GET
      // =========================

      .addCase(
        fetchRules.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchRules.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items =
            action.payload;
        },
      )

      .addCase(
        fetchRules.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.error.message ??
            "Failed to load rules";
        },
      )

      // GET ONE RULE
      .addCase(
        fetchRuleById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchRuleById.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.items.findIndex(
              (rule) =>
                String(rule.id) ===
                String(action.payload.id),
            );

          if (index === -1) {
            state.items.push(
              action.payload,
            );
          } else {
            state.items[index] =
              action.payload;
          }
        },
      )

      .addCase(
        fetchRuleById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message ??
            "Failed to load rule";
        },
      )

      // =========================
      // CREATE
      // =========================

      .addCase(
        createRule.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        createRule.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items.push(
            action.payload,
          );
        },
      )

      .addCase(
        createRule.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.error.message ??
            "Failed to create rule";
        },
      )

      // =========================
      // UPDATE
      // =========================

      .addCase(
        updateRule.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        updateRule.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.items.findIndex(
              (rule) =>
                String(rule.id) ===
                String(action.payload.id),
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }
        },
      )

      .addCase(
        updateRule.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.error.message ??
            "Failed to update rule";
        },
      )

      // =========================
      // DELETE
      // =========================

      .addCase(
        deleteRule.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        deleteRule.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            state.items.filter(
              (rule) =>
                String(rule.id) !==
                String(action.payload),
            );
        },
      )

      .addCase(
        deleteRule.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.error.message ??
            "Failed to delete rule";
        },
      );
  },
});

export default rulesSlice.reducer;