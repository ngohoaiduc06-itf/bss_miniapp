import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShopData {
  id: number | null;
  name: string;
  domain: string;
  senderEmail: string;
}

const initialState: ShopData = {
  id: null,
  name: "",
  domain: "",
  senderEmail: "",
};

const shopDataSlice = createSlice({
  name: "shopData",

  initialState,

  reducers: {
    updateSenderEmail: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.senderEmail = action.payload;
    },

    updateShopData: (
      state,
      action: PayloadAction<Partial<ShopData>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  updateSenderEmail,
  updateShopData,
} = shopDataSlice.actions;

export default shopDataSlice.reducer;