import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShopData {
  id: number | null;
  name: string;
  domain: string;
}

const initialState: ShopData = {
  id: null,
  name: "",
  domain: "",
};

const shopDataSlice = createSlice({
  name: "shopData",

  initialState,

 reducers: {
    setShopData: (
      state,
      action: PayloadAction<ShopData>,
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.domain = action.payload.domain;
    },

    updateShopData: (
      state,
      action: PayloadAction<Partial<ShopData>>,
    ) => {
      Object.assign(
        state,
        action.payload,
      );
    },

    clearShopData: (state) => {
      state.id = null;
      state.name = "";
      state.domain = "";
    },
  },
});

export const {
  setShopData,
  updateShopData,
  clearShopData,
} = shopDataSlice.actions;

export default shopDataSlice.reducer;